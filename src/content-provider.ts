/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Architect.io. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocumentContentProvider, workspace } from "vscode";
import {
  xhr,
  configure as configureHttpRequests,
  getErrorStatusDescription,
  XHRResponse,
} from "request-light";
import { ARCHITECTIO_SCHEMA_URI } from "./constants";

export interface IArchitectioSchemaCache {
  getETag(): string | undefined;
  putSchema(eTag: string, schemaContent: string): Promise<void>;
  getSchema(): Promise<string | undefined>;
}

export class ArchitectioSchemaDocumentContentProvider
  implements TextDocumentContentProvider {
  constructor(private readonly schemaCache: IArchitectioSchemaCache) {}
  async provideTextDocumentContent(): Promise<string> {
    return getSchemaContent(this.schemaCache);
  }
}

export async function getSchemaContent(
  schemaCache: IArchitectioSchemaCache
): Promise<string> {
  const cachedETag: string = schemaCache.getETag();

  const httpSettings = workspace.getConfiguration("http");
  configureHttpRequests(
    httpSettings.http && httpSettings.http.proxy,
    httpSettings.http && httpSettings.http.proxyStrictSSL
  );

  const headers: { [key: string]: string } = {
    "Accept-Encoding": "gzip, deflate",
  };
  if (cachedETag) {
    headers["If-None-Match"] = cachedETag;
  }
  return xhr({ url: ARCHITECTIO_SCHEMA_URI, followRedirects: 5, headers })
    .then(async (response) => {
      // cache only if server supports 'etag' header
      const etag = response.headers["etag"];
      if (typeof etag === "string") {
        await schemaCache.putSchema(etag, response.responseText);
      }
      return response.responseText;
    })
    .then((text) => {
      return text;
    })
    .catch(async (error: XHRResponse) => {
      // content not changed, return cached
      if (error.status === 304) {
        const content = await schemaCache.getSchema();
        // ensure that we return content even if cache doesn't have it
        if (content === undefined) {
          console.error(
            `Cannot read cached content for: ${ARCHITECTIO_SCHEMA_URI}, trying to load again`
          );
          delete headers["If-None-Match"];
          return xhr({
            url: ARCHITECTIO_SCHEMA_URI,
            followRedirects: 5,
            headers,
          })
            .then((response) => {
              return response.responseText;
            })
            .catch((err: XHRResponse) => {
              return createReject(err);
            });
        }
        return content;
      }
      // in case of some error, like internet connection issue, check if cached version exist and return it
      if (schemaCache.getETag()) {
        const content = schemaCache.getSchema();
        if (content) {
          return content;
        }
      }
      return createReject(error);
    });
}

function createReject(error: XHRResponse): Promise<string> {
  return Promise.reject(
    error.responseText ||
      getErrorStatusDescription(error.status) ||
      error.toString()
  );
}
