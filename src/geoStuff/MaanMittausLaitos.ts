interface JobQueryResponse {
    jobID: string, //"35fcbe67-32a6-4a32-accc-5cb4a3fcfad1"
    status: "accepted" | "running" | "successful" | "failed" | "dismissed",
    message: string, // "Response successful"
    progress: number, // 0 - 100
    create: string, //"2023-01-25T08:57:39.196+0200"
    links: JobLinks[]
}

interface JobLinks {
    href: string, // "https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/ogcproc/v1/jobs/35fcbe67-32a6-4a32-accc-5cb4a3fcfad1/results/"
    rel: string, // self
    type: "application/json",
    title: string
}

/*
{
  "jobID" : "35fcbe67-32a6-4a32-accc-5cb4a3fcfad1",
  "status" : "successful",
  "message" : "Response successful",
  "progress" : 100,
  "create" : "2023-01-25T08:57:39.196+0200",
  "links" : [{
    "href" : "https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/ogcproc/v1/jobs/35fcbe67-32a6-4a32-accc-5cb4a3fcfad1/results/",
    "rel" : "self",
    "type" : "application/json",
    "title" : "this document"
  }]
}
 */

/*

    accepted = työ hyväksytty ja odottaa käsittelyä
    running = työ käynnissä (progress -prosenttilukema kertoo työn edistymisen tilanteen)
    successful = työ valmis
    failed = työ epäonnistunut
    dismissed = työ keskeytetty

*/

interface JobSuccessfulResponse {
    todo: true
}

/*
{
    'uuid': 'd3bc768c-a35e-4590-9243-948e100814e8',
    'jobDescription': {
        'id': 'korkeusmalli_2m_bbox',
        'inputs': {
            'boundingBoxInput': [644075, 6948915, 646542, 6950234],
            'fileFormatInput': 'TIFF'
        }
    },
    'processId': 'korkeusmalli_2m_bbox',
    'status': 'successful',
    'progress': 100,
    'jobCreateTime': '2024-10-21T11:38:06.149+03:00',
    'statusMessage': 'successfully executed job',
    'owner': 'default',
    'results': [
        {
            'path': 'https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/dl/v1/d3bc768c-a35e-4590-9243-948e100814e8/korkeusmalli_2m.tif',
            'format': 'TIFF',
            'crs': 'etrs-tm35fin',
            'mimeType': 'image/tiff',
            'length': '3263418'
        },
        {
            'zipPath': 'https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/dl/v1/uncompressed/d3bc768c-a35e-4590-9243-948e100814e8'
        }
    ]
}
*/