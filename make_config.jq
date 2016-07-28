# Example:
#     jq -Rsf make_config.jq < keys
#

. / "\n" | {
    consumer_key: .[0],
    consumer_secret: .[1],
    access_token_key: .[2],
    access_token_secret: .[3],
}
