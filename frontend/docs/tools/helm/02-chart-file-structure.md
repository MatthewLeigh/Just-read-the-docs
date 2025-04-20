---
sidebar_position: 2
title: Chart.yaml File Structure
description: Detailed breakdown of what you will see in a Chart.yaml file.
---

The `Chart.yaml` file defines the meta data and dependencies for the Helm Chart. A lot of the meta data is optional to include, but it is detailed in it's entirety here as it is still good to include.

The following is a sample Chart.yaml file that could be used for the si-auth-service repo in Science Island. The required fields are indicated with a comment.

```yaml
apiVersion: v2                                                                           # Required
name: si-auth-service                                                                    # Required
description: A Helm chart to deploy the Science Island authentication service.
home: https://login.scienceisland.com

type: application
version: 1.0.0                                                                           # Required
appVersion: "1.16.0"
kubeVersion: ">=1.24.0"
deprecated: false

dependencies:
  - name: keycloak
    version: "23.0.0"
    repository: oci://registry-1.docker.io/bitnamicharts
    condition: keycloak.enabled
    tags:
      - keycloak
    import-values:
      - child: fullnameOverride
        parent: keycloakFullname
    alias: keycloak

maintainers:
  - name: Matthew Cross
    email: 101828627@student.swin.edu.au
    url: https://contact-site.com

sources:
  - https://github.com/science-island/si-auth-service

icon: https://science-island.edu.au/assets/icon-auth-service.png

keywords:
  - authentication
  - keycloak
  - science-island
  - helm-chart

annotations:
  category: "Security"
  license: "MIT"
  artifacthub.io/links: |
    - name: Documentation
      url: https://educationnetworkgroup.github.io/si-docs/
```

> Note that as of `v3.3.2`, additional fields are not permitted in the Chart.yaml file. Custom meta data can be included in `annotation` if required.

---

## apiVersion

```yaml
apiVersion: v2
```

Used to indicate the Helm Chart api version being used. The current version is `v2` (As of April, 2025).

---

## name

```yaml
name: si-auth-service
```

The name of the Helm Chart. Best practice is to have this match the name of the directory containing the chart, which is typically the name of the service being deployed.

---

## description

```yaml
description: A Helm chart to deploy the Science Island authentication service.
```

A brief description of what the chart does. This helps with documenting the purpose of the Helm Chart.

---

## home

```yaml
home: https://login.scienceisland.com
```

A link to the application's homepage.

---

## type

```yaml
type: application
```

Specifies the chart type as either `application` or `library`.

- **Application**: Means that this is an application being deployed. This is the default value, and assumed if not explicitly stated.
- **Library**: Indicates that this is a Helm Library Chart that is used by other charts, but not installed directly.

---

## version

```yaml
version: 1.0.0
```

The version of the chart. Follow [Semantic Versioning](https://semver.org/) when updating the version.

---

## appVersion

```yaml
appVersion: "1.16.0"
```

Specifies the version of the application this chart deploys. This is informative to the developer if used properly, but does not affect the Helm package version.

---

## kubeVersion

```yaml
kubeVersion: ">=1.24.0"
```

Specifies the minimum (and optionally maximum) compatible Kubernetes version for this chart. Helm will issue a warning if the cluster version falls outside this range.

---

## deprecated

```yaml
deprecated: false
```

Specifies whether the chart is deprecated or not. Set to true if there is an alternate chart that should be used instead.

Value is set to false by default. This field can be left out of most files.

---

## dependencies

```yaml
dependencies:
  - name: keycloak                                                                       # Required
    version: "23.0.0"                                                                    # Required
    repository: oci://registry-1.docker.io/bitnamicharts                                 # Required
    condition: keycloak.enabled
    tags:
      - keycloak
    import-values:
      - child: fullnameOverride
        parent: keycloakFullname
    alias: keycloak
```

Specifies any external Helm Charts that the current chart depends on.

| Field          | Description |
| -------------- | ----------- |
| `name`         | The name of the dependency chart. This should match the name in the dependency chart’s own Chart.yaml. |
| `version`      | The version of the dependency chart being used. |
| `repository`   | The URL or OCI registry of the chart repository containing the dependency. `Open Container Initiative (OCI)` means that the dependency is coming from a container registry like Docker Hub or GitHub Container Registry.
| `condition`    | A conditional value from `values.yaml` that determines whether the dependency is enabled or not. If the condition evaluates to false, the dependency is not rendered of deployed. |
| `tags`         | A list of tags that can be used to further enable or disable groups of charts using values. |
| `import-values`|  Used to import values from the child chart into the parent chart’s values. Each item maps a value from the child to a location in the parent. |
| `alias`        | Overrides the chart name when referenced in templates or values. This is useful when multiple instances of the same chart are being used, or when you want to follow a consistent naming convention. |

> Only the name, version, and repository fields are required to install a dependency.

---

## maintainers

```yaml
maintainers:
  - name: Matthew Cross
    email: 101828627@student.swin.edu.au
    url: https://contact-site.com
```

Specifies a list of people responsible for maintaining the chart. Multiple entries can be included under maintainers.

Each entry should include a `name` and `email`. The `url` property is optional.

---

## sources

```yaml
sources:
  - https://github.com/science-island/si-auth-service
```

A list of source repositories or URLs relevant to the project. Usually this is the source code for the application being packaged.

---

## icon

```yaml
icon: https://science-island.edu.au/assets/icon-auth-service.png
```

A URL pointing to an icon representing the chart or application. This may be displayed by chart repositories and UIs to make charts easier to identify.

---

## keywords

```yaml
keywords:
  - authentication
  - keycloak
  - science-island
  - helm-chart
```

Keywords to help users search for and discover this chart in repositories or Helm UIs like Artifact Hub.

Can safely ignore if the Helm Chart is not intended to be discoverable outside of the organization.

---

## annotations

```yaml
annotations:
  category: "Security"
  license: "MIT"
  artifacthub.io/links: |
    - name: Documentation
      url: https://educationnetworkgroup.github.io/si-docs/
```

Annotations are `key-value pairs` of metadata attached to the chart. They are not used within the chart, but provide additional context. These are often used for chart repositories.
