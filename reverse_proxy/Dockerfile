FROM traefik:v2.2
ARG VERSION
LABEL app_name=kabaliserv_cloudshare
LABEL stage=prod
LABEL version=${VERSION}
CMD ["--api.insecure=true", "--api.dashboard=true", "--providers.docker"]