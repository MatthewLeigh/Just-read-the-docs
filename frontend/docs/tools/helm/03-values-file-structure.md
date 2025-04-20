---
sidebar_position: 3
title: values.yaml File Structure
description: Detailed breakdown of what you will see in a values.yaml file.
---

The `values.yaml` file in a Helm chart defines default configuration values for the chart's templates. It allows customization of deployment settings like images, services, ingress, and subchart behavior without editing templates directly.

This document provides an annotated and simplified example of a values.yaml file that could be used for the si-auth-service Helm chart in Science Island.

It is hard to define a generic values.yaml file as they are so specific to the project. To use this guide, please identify features you want to use in the sample, and then navigate to the appropriate section to see how they have been implemented in this example.

```yaml
global:
  imagePullSecrets:
    - dockerconfigjson-github-com
  defaultStorageClass: keycloak-efs-ap

storageClass:
  name: keycloak-efs-ap
  provisioner: efs.csi.aws.com
  parameters:
    provisioningMode: efs-ap
    fileSystemId: fs-xxxxxxxxxxxxxxxxx

ingress:
  - domainName: login.scienceisland.com
    servicePort: 8080

keycloak:
  image:
    registry: ghcr.io/educationnetworkgroup
    repository: si-keycloak
    tag: "main"
    pullPolicy: Always

  command:
    - /opt/bitnami/keycloak/bin/kc.sh
    - start
    - --import-realm
    - --hostname-debug=true
    - --health-enabled=true
    - --metrics-enabled=true

  metrics:
    enabled: true
    service:
      extraPorts:
        - name: Admin Port
          port: 9000
          targetPort: 9000

  extraEnvVars:
    - name: KC_HOSTNAME
      value: login.scienceisland.com
    - name: KC_PROXY
      value: edge

  service:
    ports:
      http: 8080
      https: 8443

  customReadinessProbe:
    httpGet:
      path: /realms/master
      port: 9000
      scheme: HTTP
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 1
    failureThreshold: 3
    successThreshold: 1

  serviceAccount:
    create: false
    name: keycloak

  postgresql:
    enabled: true
    volumePermissions:
      containerSecurityContext:
        runAsUser: 50000
        runAsGroup: 50000
    primary:
      containerSecurityContext:
        runAsUser: 50000
        runAsGroup: 50000
```

> Please note that in this example, `storageClass` and `ingress` have been defined in templates, while `keycloak` is a dependency.

---

## global

```yaml
global:
  imagePullSecrets:
    - dockerconfigjson-github-com
  defaultStorageClass: keycloak-efs-ap
```

`global` defines the global values which are shared across subcharts. Here, it is defining the following:

- **imagePullSecrets**: Specifies the name of a Kubernetes secret that contains credentials for pulling container images from a private registry. This ensures the cluster can authenticate and retrieve images that aren’t publicly accessible.
- **defaultStorageClass**: Sets the default storage class to be used by charts that support dynamic volume provisioning. Subcharts that rely on persistent volumes (e.g., databases) can inherit this value instead of requiring it to be defined explicitly.

---

## storageClass

```yaml
storageClass:
  name: keycloak-efs-ap
  provisioner: efs.csi.aws.com
  parameters:
    provisioningMode: efs-ap
    fileSystemId: fs-xxxxxxxxxxxxxxxxx
```

Here, `storageClass` defines how storage will be provisioned for the deployment. The values defined here will be used to create a persistent volume in Kubernetes.

- **name**: Specifies the name of the StorageClass to be used. In this example, it is `keycloak-efs-ap`.
- **provisioner**: The provisioner is responsible for creating and managing persistent volumes. Here, it is set to `efs.csi.aws.com`, which means the storage will be provisioned using Amazon `Elastic File System (EFS)` with the `Container Storage Interface (CSI)` driver.
- **parameters**: Additional configuration parameters.
  - **provisioningMode**: Specifies the provisioning mode, which is set to `efs-ap` in this case.
  - **fileSystemId**: Refers to the Amazon EFS file system ID that will be used to create the volume (if applicable). Replace fs-xxxxxxxxxxxxxxxxx with your actual file system ID.

### Context: StorageClass Template

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: {{ .Values.storageClass.name }}
provisioner: {{ .Values.storageClass.provisioner }}
parameters:
  provisioningMode: {{ .Values.storageClass.parameters.provisioningMode }}
  fileSystemId: {{ .Values.storageClass.parameters.fileSystemId }}
  directoryPerms: "777"
```

This StorageClass Template demonstrates how Helm values are used to configure the StorageClass resource in Kubernetes. The `{{ .Values.* }}` syntax pulls in values from the `values.yaml` file. Here's what happens in the template:

---

## ingress

```yaml
ingress:
  - domainName: login.scienceisland.com
    servicePort: 8080
```

The `ingress` section defines the external access settings for the service. In Kubernetes, an ingress is used to manage external access to the services within the cluster, typically HTTP. It allows you to expose HTTP and HTTPS routes to services based on their paths or domains.

---

## keycloak

### image

```yaml
image:
  registry: ghcr.io/educationnetworkgroup
  repository: si-keycloak
  tag: "main"
  pullPolicy: Always
```

The `image` section of a dependency defines the Docker image configuration. Here, we have defined the following:

- **registry**: Specifies the Docker registry where the image is stored.
- **repository**: Specifies the repository where in the image is stored / the name of the package.
- **tag**: Specifies the version / variant of the image to use.
- **pullPolicy**: Specifies when the image should be pulled from the registry. `Always` means that the image is always pulled, even if it already exists locally. This is a good standard policy to ensure that the version is always up-to-date.

### command

```yaml
command:
  - /opt/bitnami/keycloak/bin/kc.sh
  - start
  - --import-realm
  - --hostname-debug=true
  - --health-enabled=true
  - --metrics-enabled=true
```

The `command` section specifies the commands to run when the container starts.

### metrics

```yaml
metrics:
  enabled: true
  service:
    extraPorts:
      - name: Admin Port
        port: 9000
        targetPort: 9000
```

The `metrics` section controls the collection and exposure of metrics for monitoring purposes. Here, metrics are enable, and exposed via an Admin Port on port 9000.

### extraEnvVars

```yaml
extraEnvVars:
  - name: KC_HOSTNAME
    value: login.scienceisland.com
  - name: KC_PROXY
    value: edge
```

The `extraEnvVars` section specifies additional environment variables which are passed to the container at runtime.

### service

```yaml
service:
  ports:
    http: 8080
    https: 8443
```

The `service` section is used to define the configuration for exposing a service within the Kubernetes cluster or externally. It specifies the ports the service will use for communication and how it will be accessed. Here, we simply expose ports 8080 and 8443 to external and internal access.

### customReadinessProbe

```yaml
customReadinessProbe:
  httpGet:
    path: /realms/master
    port: 9000
    scheme: HTTP
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 1
  failureThreshold: 3
  successThreshold: 1
```

The `customReadinessProbe` section is used to configure a readiness probe for the service. A `readiness probe` is an HTTP or TCP check that Kubernetes uses to determine whether the application is ready to accept requests. This ensures that Kubernetes only routes traffic to the container when it has passed the readiness check, ensuring better stability and reliability for the application.

In this example:

- **httpGet**: Defines an HTTP request to check if the application is healthy. The request is made to /realms/master on port 9000 with the HTTP scheme.
- **initialDelaySeconds**: Time to wait before starting the readiness checks after the container starts (30 seconds).
- **periodSeconds**: The frequency at which the probe is executed (every 10 seconds).
- **timeoutSeconds**: The time to wait for the probe to respond (1 second).
- **failureThreshold**: The number of failed attempts before considering the container as not ready (3).
- **successThreshold**: The number of successful probes before considering the container as ready (1).

### serviceAccount

```yaml
serviceAccount:
  create: false
  name: keycloak
```

The serviceAccount section is used to configure the Kubernetes Service Account for the container. A Service Account provides an identity for processes running in a Pod to access the Kubernetes API or other services.

Here, we have set `create` to `false`, which and indicated that a pre-existing Service Account named `keycloak` will be used, and Kubernetes will not create a new one.

### postgresql

```yaml
postgresql:
  enabled: true
  volumePermissions:
    containerSecurityContext:
      runAsUser: 50000
      runAsGroup: 50000
  primary:
    containerSecurityContext:
      runAsUser: 50000
      runAsGroup: 50000
```

The `postgresql` section is used to configure PostgreSQL-related settings, since we are using PostgreSQL as a part of the deployment. You can change this out for any db that is being used.

The following have ben set in this example:

- **enabled**: This field is set to true, indicating that the PostgreSQL database is enabled and should be deployed alongside the other components. If set to false, PostgreSQL would be disabled and not part of the deployment.
- **volumePermissions**: This section defines the security context for the volume that will store PostgreSQL data.
  - **containerSecurityContext**: Specifies the security settings for the container that handles PostgreSQL. In this example, the container is configured to run as a user with the UID 50000 and the GID 50000, which helps control file system permissions and ensures the container can read/write to the PostgreSQL data volume.
- **primary**: This section specifies the container security settings for the primary PostgreSQL instance.
  - **containerSecurityContext**: Similar to the volumePermissions section, this specifies that the container running the primary PostgreSQL instance will also use the UID and GID 50000 to manage file permissions.
