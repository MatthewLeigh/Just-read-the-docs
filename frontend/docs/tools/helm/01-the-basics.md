---
sidebar_position: 1
title: The Basics
description: Understand the Helm Chart structure.
---

Helm is a package manager for Kubernetes that helps you define, install, and manage applications. Helm charts are packages of pre-configured Kubernetes resources that allow for easy deployment and scaling of applications. Charts are reusable and customizable, making it easier to manage Kubernetes applications.

A Helm chart consists of templates, configuration values, and metadata that define Kubernetes resources like deployments, services, and ingress. When you deploy a chart, Helm takes these templates and renders them into Kubernetes manifests by substituting values from the values.yaml file (or from the command line). Helm then sends the final rendered manifests to the Kubernetes API server for deployment.

## Helm Chart Structure

Helm Charts consist of a structured set of files and directories that work together to define, configure, and deploy Kubernetes applications. Below is the typical structure of a `Helm Chart`.

```text
└── helm
    ├── LICENSE
    ├── README.md
    ├── .helmignore
    ├── Chart.yaml
    ├── values.yaml
    ├── charts
    └── templates
        ├── NOTES.txt
        ├── _helpers.tpl
        ├── deployment.yaml
        ├── hpa.yaml
        ├── ingress.yaml
        ├── service.yaml
        ├── serviceaccount.yaml
        └── tests
```

Let's take a quick look at what everything does.

| File / Folder                    | Required    | Description |
| -------------------------------- | ----------- | ----------- |
| `LICENSE`                        | No          | Includes open source license. |
| `README.md`                      | No          | Can include notes / basic information about the Helm Chart here. |
| `.helmignore`                    | Recommended | Defines patterns to ignore when building packages. |
| `Chart.yaml`                     | Yes         | Contains the meta data for the chart. |
| `values.yaml`                    | Yes         | Contains the default configuration values that the templates refer to. |
| `charts folder`                  | No          | Holds subcharts or chart dependencies. |
| `templates folder`               | Yes         | This is the heart of the Helm Chart where you include the Kubernetes resources templates. The templates included here, combined with the default values in values.yaml, are what inform the Kubernetes manifest file. This folder must contain at least one valid file. |
| `templates/NOTES.txt`            | Optional    | This is an optional file which provides information about our helm chart , This file is rendered same as regular template file by helm , after notes.txt is rendered its not sent to k8s cluster , but output is displayed in CLI window. |
| `templates/_helpers.yaml`        | Optional    | Defines help functions / macros for the templates to use. |
| `templates/deployment.yaml`      | Recommended | Describes how to deploy the application. |
| `templates/hpa.yaml`             | No          | Defines HorizontalPodAutoscaler resources if for auto-scaling, if required. |
| `templates/ingress.yaml`         | Optional    | Defines ingress rules to expose services outside the cluster. Needed only if external access is required. |
| `templates/service.yaml`         | Recommended | Exposes pods via a Kubernetes Service. |
| `templates/serviceaccount.yaml`  | No          | If required, defines the service account that the app should run as. |
| `templates/tests folder`         | No          | Contains Helm test hooks to verify that the chart works. |
