import axios from 'axios'
const baseUrl = 'https://avoin-paikkatieto.maanmittauslaitos.fi/tiedostopalvelu/ogcproc/v1/'

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



export const mmlDepth2mBBOX = async () => {
    const api_avain = '7737f837-ab4a-4765-9727-6deaa4a80082' // proc enw later

    const processUrl = baseUrl + "processes/korkeusmalli_2m_bbox/execution"

    // ADD VALIDATION
    function wait(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    const request_json = {
        id: "korkeusmalli_2m_bbox",
        inputs: {
            boundingBoxInput: [
                643299,
                6948017,
                644299,
                6949017],
            fileFormatInput: "TIFF"
        }
    }

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
        console.log('error:', e)
        return undefined
    })


    if (!executionResponse){
        console.log('MaanMittausApi execution response failure..')
        return undefined
    }

    const jobUrl = executionResponse.links[0].href


    const requestAndRetry = async () => {
        let retries = 15
        let timeout = 1500
    
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
                console.log('error:', e)
                retries = 0
                throw new Error('MaanMittausApi job response failure..')
            })

            console.log(result.status)

            if (result.status == 'successful'){
                return result
            }

            await wait(timeout)
            retries--;
        }

        throw new Error('Request failed after 10 retries');
    }


    let jobResutsUrl
    try{
        const finalExecutionResponse: JobExecutionResponse = await requestAndRetry()
        jobResutsUrl = finalExecutionResponse.links[0].href
    } catch (e){
        console.log('error:', e)
        return undefined
    }

    const successResponse: JobSuccessfulResponse = await axios.get(
        jobResutsUrl,
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
    return successResponse.results[0].path
}