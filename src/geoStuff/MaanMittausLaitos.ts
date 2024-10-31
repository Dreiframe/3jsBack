import axios from 'axios'
const baseUrl = 'https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/ogcproc/v1/'

// INFO:
// https://www.maanmittauslaitos.fi/paikkatiedon-tiedostopalvelu/tekninen-kuvaus
// https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/ogcproc/v1/processes

// execution res#########################################################################################
interface JobExecutionResponse {
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
    type: string |"application/json",
    title: string
}


// job uuid res#########################################################################################
interface JobSuccessfulResponse {
    uuid: string, // 'd3bc768c-a35e-4590-9243-948e100814e8'
    jobDescription: JobDescription,
    processId: string, //'korkeusmalli_2m_bbox'
    status: "accepted" | "running" | "successful" | "failed" | "dismissed",
    progress: number, // 0 - 100
    jobCreateTime: string, //'2024-10-21T11:38:06.149+03:00'
    statusMessage: string,//'successfully executed job'
    owner: string, //'default'
    results: JobResults[]
}

interface JobDescription {
    id: string | 'korkeusmalli_2m_bbox',
    inputs: {
        boundingBoxInput: number[], // [1, 2, 3, 4]
        fileFormatInput: string | 'TIFF'
    }
}


interface JobResults {
    path: string, // download url
    format: string | 'TIFF',
    crs: string | 'etrs-tm35fin',
    mimeType: string | 'image/tiff',
    length: string // but its number in string..
}


export const mmlElevation2mBBOX = async (bbox: number[]) => {
    // INFO
    // https://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/aineistot-ja-rajapinnat/tuotekuvaukset/korkeusmalli-2-m
    // https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/ogcproc/v1/processes/korkeusmalli_2m_bbox

    const api_avain = '7737f837-ab4a-4765-9727-6deaa4a80082' // proc enw later

    const processUrl = baseUrl + "processes/korkeusmalli_2m_bbox/execution"

    // ADD VALIDATION
    // VALIDATION HERE ##########################################################

    // wait function to poll job status
    function wait(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    // creating json to post
    const request_json = {
        id: "korkeusmalli_2m_bbox",
        inputs: {
            boundingBoxInput: bbox,
            fileFormatInput: "TIFF"
        }
    }

    // Requesting maanmittausapi to start 2mbbox job process
    const executionResponse: JobExecutionResponse = await axios.post(
        processUrl,
        request_json,
        {auth: {
            username: api_avain,
            password: ''
        }}
    ).then(response => {
        return response.data
    }).catch(e => {
        // console.log('error:', e)
        return undefined
    })

    if (!executionResponse){
        console.log('MaanMittausApi execution failure. Job process not started. Api down?')
        return undefined
    }


    // This is the url to the started job.
    const jobUrl = executionResponse.links[0].href


    // Function that polls job url.
    // Polls the api until successfull(which means the job was completed) or too many retries which throws error.
    const requestAndRetry = async () => {
        let retries = 15 // maximum retries
        let timeout = 1500 // waiting time in milliseconds between each poll
    
        while(retries > 0) {
            const result: JobExecutionResponse = await axios.get(
                jobUrl,
                {auth: {
                    username: api_avain,
                    password: ''
                }}
            ).then(response => {
                return response.data
            }).catch(e => {
                //console.log('error:', e)
                retries = 0 // set retries to 0 to exit loop because error duh
                throw new Error('MaanMittausApi job response failure..')
            })

            console.log('Status:', result.status)  // delete later

            if (result.status == 'successful'){
                return result
            }

            await wait(timeout)
            retries--;
        }

        throw new Error('Request failed after 10 retries');
    }


    // polling maanmittauslaitus job until status is succesful.
    // if successful set jobResultUrl to be url path for job results
    let jobResultsUrl
    try{
        const finalExecutionResponse: JobExecutionResponse = await requestAndRetry()
        jobResultsUrl = finalExecutionResponse.links[0].href
    } catch (e){
        console.log('error:', e)
        return undefined
    }

    // get job results from maanmittauslaitos.
    const successResponse: JobSuccessfulResponse = await axios.get(
        jobResultsUrl,
        {auth: {
            username: api_avain,
            password: ''
        }}
    ).then(response => {
        return response.data
    }).catch(e => {
        console.log('error:', e)
        return undefined
    })

    console.log(successResponse.results[0].path)

    // returning url path to depthmap/elevation.tif file.
    // example: https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/dl/v1/uuid-jobid/korkeusmalli_2m.tif
    return successResponse.results[0].path
}