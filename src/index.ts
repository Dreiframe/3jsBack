import express, { Express, json } from "express"
import cors from 'cors'

const app: Express = express()
app.use(cors())
app.use(json());

import { mmlElevation2mBBOX } from "./geoStuff/MaanMittausLaitos";
app.post('/api/2m', async (request, response) => {
    // add validation
    // The numbers are in decimal degrees format and range from -90 to 90 for latitude and -180 to 180 for longitude.

    interface requestBody {
        latitude: number, 
        longitude: number
    }

    // lat long to coordinates const
    const coordiantes: { latitude: number, longitude: number } = request.body

    // convert wgs84 lat long to etrs89 east north
    const [easting, northing] = WGS84toETRS89(coordiantes.latitude, coordiantes.longitude)

    //create 1 square km bounding box from position.
    const bbox = bboxFromETRS89(easting, northing)

    // get tif(elevationmap) download url path from maanmittauslaitos api
    const result = await mmlElevation2mBBOX(bbox)

    response.json({path: result})
})

import { WGS84toETRS89, bboxFromETRS89 } from "./geoStuff/WGS84toETRS89";
app.post('/api', (request, response) => {
    // add validation
    // The numbers are in decimal degrees format and range from -90 to 90 for latitude and -180 to 180 for longitude.

    interface requestBody {
        latitude: number, 
        longitude: number
    }

    // lat long to coordinates const
    const coordiantes: { latitude: number, longitude: number } = request.body

    // convert wgs84 lat long to etrs89 east north
    const [easting, northing] = WGS84toETRS89(coordiantes.latitude, coordiantes.longitude)

    //create 1 square km bounding box from position.
    const bbox = bboxFromETRS89(easting, northing)

    response.json({easting, northing, bbox})
})

import { readFile } from "fs";

app.get('/tif', (request, response) => {
    readFile('./src/files/main_test.tif', (err, tiff) => {
        if (err){
            response.status(400).send('<p>failed</p>')
            console.log(err)
            return
        }

        console.log('tif file served')

        response.setHeader('Content-Type', 'image/tiff')
        //response.setHeader('Content-Length', '3263418')
        response.send(tiff)
    })
})

app.get('/pcd', (request, response) => {
    readFile('./src/files/main_test.pcd', (err, tiff) => {
        if (err){
            response.status(400).send('<p>failed</p>')
            console.log(err)
            return
        }

        console.log('pcd file served')

        response.setHeader('Content-Type', 'text/pcd')
        response.send(tiff)
    })
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});