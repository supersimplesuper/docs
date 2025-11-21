# Uploading SAFF files

Uploading a SAFF file into our SuperSend product starts the process of converting it to an ABA file, ready to be uploaded to your bank to disburse payments.

## Getting started

To get started, you will need to have two things setup:

1. You will need a product key provisioned ([you can test your key is working](https://docs.superapi.com.au/software_partners/how_to_guides/verify_my_product_api_key/))
2. You need to have [created an employer](https://docs.superapi.com.au/software_partners/how_to_guides/create_an_employer/) using that product key.

Once you have created the employer (and make sure to note down the `id` as this will be used shortly), you have everything in place to upload your SAFF file.

## Performing the upload

To perform the upload:

```bash
apiKey=superapi_productYourApiKey
local_file_path=test/saff_test.csv
employer_id=6b442442-6034-4706-b5d5-eb42dbf2ff71

curl -X POST https://api.superapi.com.au/api/v1/super-send/$employer_id/upload-saff \
    -H "x-api-key: $apiKey" \
    -F "file=@$local_file_path"
```

On response, you will receive an object similar to:

```json
{
  "accepted": true,
  "documentResult": {
    "severity": "Information",
    "code": "OBAN.INFO.Pending",
    "description": "Uploaded SAFF file (File Id: ABC123) is pending validation",
    "context": [
      {
        "name": "DateProcessed",
        "value": "2024-05-24T02:35:54.1945304Z"
      },
      {
        "name": "FileID",
        "value": "ABC123"
      }
    ]
  }
}
```
