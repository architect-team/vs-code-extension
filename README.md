<p align="center">
  <img width="320" alt="Architect Logo" src="https://cdn.architect.io/logo/horizontal-inverted.png">
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=architect.io.architect-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/architect.io.architect-vscode?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code" alt="Build" /></a>
  <a href="https://github.com/architect-team/vs-code-extension/blob/main/LICENSE"><img src="https://img.shields.io/github/license/architect-team/vs-code-extension?style=for-the-badge" alt="License" /></a>
</p>


Adds YAML Language support, syntax highlighting and validation when editing or creating `architect.yml` files in Visual Studio Code.

Architect is the world's first [DevOps-as-a-Service](//architect.io/product) toolset designed to help democratize environment provisioning for engineers. With Architect, anyone can deploy any service, anywhere, for any reason with the push of a button.

Our unique approach to continuous delivery is powered by an embedded dependency resolver. By simply asserting your microservice dependenies, Architect is able to build a graph of your application and deploy the entire stack to your favorite cloud provider.

Architect's CLI, which provides the full developer experience needed to create [components](//docs.architect.io) and operate local [environments](//docs.architect.io/deployments/local-environments), is fully open-source. The CLI can deploy components locally using docker-compose, enrich the deployments with components found in Architect's Cloud registry, and allows developers to publish their own components to the registry both publicly and privately for free.

# Requirements
* [**Node.js** `v12`](//nodejs.org/en/download/) or higher must be installed

# YAML Schema
For additional information describing the full specification of the architect.yml configuration file, please view [the architect yml reference guide](https://docs.architect.io/reference/architect-yml/).

Additionally, we've published a formal definition of this specification here: [Architect JSONSchema](https://raw.githubusercontent.com/architect-team/architect-cli/master/src/dependency-manager/schema/architect.schema.json).
