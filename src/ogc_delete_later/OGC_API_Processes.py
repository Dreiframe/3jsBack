import requests
from requests.auth import HTTPBasicAuth
import time


def korkeusmalli_2m_bbox(bbox, api_key):
    url = "https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/ogcproc/v1/" \
          "processes/korkeusmalli_2m_bbox/execution"

    if type(bbox) != list:
        raise Exception('Bounding box is not a list.')

    if len(bbox) != 4:
        raise Exception('Bounding box is not a valid size.')

    if type(api_key) != str:
        raise Exception('api_key has to be a string.')

    request_json = {
        "id": "korkeusmalli_2m_bbox",
        "inputs": {
            "boundingBoxInput": bbox,
            "fileFormatInput": "TIFF"
        }
    }

    try:
        response = requests.post(url, auth=HTTPBasicAuth(api_key, ''), json=request_json)
    except requests.exceptions.RequestException as e:
        print(e)
        return None

    if response.status_code != 201:
        if response.status_code == 401:
            print('Authentication error:', response.status_code)
        else:
            print('error:', response.status_code)
        return None
    response = response.json()

    if response["status"] == 'accepted':
        print("status", response["status"])
        job_url = response["links"][0]["href"]
        while response["status"] != 'failed' or response["status"] != 'dismissed':
            if response["status"] == "successful":
                print("status", response["status"])
                break
            time.sleep(3)
            print("status:", response["status"], "| progress:", response["progress"])
            try:
                response = requests.get(job_url + "/results/", auth=HTTPBasicAuth(api_key, '')).json()
            except requests.exceptions.RequestException as e:
                print(e)
                return None
    else:
        print("Failure:", response["status"])
        return None

    if response["status"] == 'failed' or response["status"] == 'dismissed':
        print('Failed:', response["status"])
        return None

    print('Loading TIFF.')
    tiff_url = response["results"][0]["path"]
    tiff = requests.get(tiff_url).content

    return tiff


if __name__ == "__main__":
    from Coordinate_Converter import latlong2epsg, bbox_from_position
    east, north = latlong2epsg(62.64618981262014, 29.81811204280251)
    BoundingBox = bbox_from_position(east, north)
    tiff_file = korkeusmalli_2m_bbox(BoundingBox, 'does-not-work-wrong-api')
    if tiff_file is not None:
        with open('./2m_bbox/test.tif', 'wb') as file:
            file.write(tiff_file)
            print('File saved. Program done.')
