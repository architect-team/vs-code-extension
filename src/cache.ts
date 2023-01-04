/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Architect.io. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from "fs-extra";
import * as path from "path";
import * as crypto from "crypto";
import { Memento } from "vscode";
import { logToExtensionOutputChannel } from "./extension";
import { IArchitectioSchemaCache } from "./content-provider";
import {
  ARCHITECTIO_CACHE_DIR,
  ARCHITECTIO_CACHE_KEY,
  ARCHITECTIO_SCHEMA_URI,
} from "./constants";

interface CacheEntry {
  eTag: string;
  schemaPath: string;
}

interface ArchitectioSchemaCacheEntry {
  [uri: string]: CacheEntry;
}

export class ArchitectioSchemaCache implements IArchitectioSchemaCache {
  private readonly cachePath: string;
  private readonly cache: ArchitectioSchemaCacheEntry;

  private isInitialized = false;

  constructor(globalStoragePath: string, private memento: Memento) {
    this.cachePath = path.join(globalStoragePath, ARCHITECTIO_CACHE_DIR);
    this.cache = memento.get(ARCHITECTIO_CACHE_KEY, {});
  }

  private async init(): Promise<void> {
    await fs.ensureDir(this.cachePath);
    const cachedFiles = await fs.readdir(this.cachePath);
    // clean up memento if cached files was deleted from fs
    const cachedValues = cachedFiles.map((it) => path.join(this.cachePath, it));
    for (const key in this.cache) {
      if (Object.prototype.hasOwnProperty.call(this.cache, key)) {
        const cacheEntry = this.cache[key];
        if (!cachedValues.includes(cacheEntry.schemaPath)) {
          delete this.cache[key];
        }
      }
    }
    await this.memento.update(ARCHITECTIO_CACHE_KEY, this.cache);
    this.isInitialized = true;
  }

  private getCacheFilePath(uri: string): string {
    const hash = crypto.createHash("MD5");
    hash.update(uri);
    const hashedURI = hash.digest("hex");
    return path.join(this.cachePath, hashedURI);
  }

  getETag(): string | undefined {
    if (!this.isInitialized) {
      return undefined;
    }
    return this.cache[ARCHITECTIO_SCHEMA_URI]?.eTag;
  }

  async putSchema(eTag: string, schemaContent: string): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }
    if (!this.cache[ARCHITECTIO_SCHEMA_URI]) {
      this.cache[ARCHITECTIO_SCHEMA_URI] = {
        eTag,
        schemaPath: this.getCacheFilePath(ARCHITECTIO_SCHEMA_URI),
      };
    } else {
      this.cache[ARCHITECTIO_SCHEMA_URI].eTag = eTag;
    }
    try {
      const cacheFile = this.cache[ARCHITECTIO_SCHEMA_URI].schemaPath;
      await fs.writeFile(cacheFile, schemaContent);
      await this.memento.update(ARCHITECTIO_CACHE_KEY, this.cache);
    } catch (err) {
      delete this.cache[ARCHITECTIO_SCHEMA_URI];
      logToExtensionOutputChannel(err);
    }
  }

  async getSchema(): Promise<string | undefined> {
    if (!this.isInitialized) {
      await this.init();
    }
    const cacheFile = this.cache[ARCHITECTIO_SCHEMA_URI]?.schemaPath;
    if (await fs.pathExists(cacheFile)) {
      return await fs.readFile(cacheFile, { encoding: "UTF8" });
    }
    return undefined;
  }
}
