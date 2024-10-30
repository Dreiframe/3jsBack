import proj4 from "proj4"

export const crsTransform = () => {
    proj4.defs([
        [
          'EPSG:4326',
          '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
        [
          'EPSG:3067',
          '+title=ETRS89 +proj=longlat'
        ]
      ]
    )

    const finnishProjectionWKT2 = 'PROJCRS["ETRS89 / TM35FIN(E,N)",' +
        'BASEGEOGCRS["ETRS89",' +
            'ENSEMBLE["European Terrestrial Reference System 1989 ensemble",' +
                'MEMBER["European Terrestrial Reference Frame 1989"],' +
                'MEMBER["European Terrestrial Reference Frame 1990"],' +
                'MEMBER["European Terrestrial Reference Frame 1991"],' +
                'MEMBER["European Terrestrial Reference Frame 1992"],' +
                'MEMBER["European Terrestrial Reference Frame 1993"],' +
                'MEMBER["European Terrestrial Reference Frame 1994"],' +
                'MEMBER["European Terrestrial Reference Frame 1996"],' +
                'MEMBER["European Terrestrial Reference Frame 1997"],' +
                'MEMBER["European Terrestrial Reference Frame 2000"],' +
                'MEMBER["European Terrestrial Reference Frame 2005"],' +
                'MEMBER["European Terrestrial Reference Frame 2014"],' +
                'MEMBER["European Terrestrial Reference Frame 2020"],' +
                'ELLIPSOID["GRS 1980",6378137,298.257222101,' +
                    'LENGTHUNIT["metre",1]],' +
                'ENSEMBLEACCURACY[0.1]],' +
            'PRIMEM["Greenwich",0,' +
                'ANGLEUNIT["degree",0.0174532925199433]],' +
            'ID["EPSG",4258]],' +
        'CONVERSION["TM35FIN",' +
            'METHOD["Transverse Mercator",' +
                'ID["EPSG",9807]],' +
            'PARAMETER["Latitude of natural origin",0,' +
                'ANGLEUNIT["degree",0.0174532925199433],' +
                'ID["EPSG",8801]],' +
            'PARAMETER["Longitude of natural origin",27,' +
                'ANGLEUNIT["degree",0.0174532925199433],' +
                'ID["EPSG",8802]],' +
            'PARAMETER["Scale factor at natural origin",0.9996,' +
                'SCALEUNIT["unity",1],' +
                'ID["EPSG",8805]],' +
            'PARAMETER["False easting",500000,' +
                'LENGTHUNIT["metre",1],' +
                'ID["EPSG",8806]],' +
            'PARAMETER["False northing",0,' +
                'LENGTHUNIT["metre",1],' +
                'ID["EPSG",8807]]],' +
        'CS[Cartesian,2],' +
            'AXIS["(E)",east,' +
                'ORDER[1],' +
                'LENGTHUNIT["metre",1]],' +
            'AXIS["(N)",north,' +
                'ORDER[2],' +
                'LENGTHUNIT["metre",1]],' +
        'USAGE[' +
            'SCOPE["Engineering survey, topographic mapping."],' +
            'AREA["Finland - onshore and offshore."],' +
            'BBOX[58.84,19.08,70.09,31.59]],' +
        'ID["EPSG",3067]]'

    
    const finnishProjectionWKT1 = 'PROJCS["ETRS89 / TM35FIN(E,N)",' +
        'GEOGCS["ETRS89",' +
            'DATUM["European_Terrestrial_Reference_System_1989",' +
                'SPHEROID["GRS 1980",6378137,298.257222101,' +
                    'AUTHORITY["EPSG","7019"]],' +
                'AUTHORITY["EPSG","6258"]],' +
            'PRIMEM["Greenwich",0,' +
                'AUTHORITY["EPSG","8901"]],' +
            'UNIT["degree",0.0174532925199433,' +
                'AUTHORITY["EPSG","9122"]],' +
            'AUTHORITY["EPSG","4258"]],' +
        'PROJECTION["Transverse_Mercator"],' +
        'PARAMETER["latitude_of_origin",0],' +
        'PARAMETER["central_meridian",27],' +
        'PARAMETER["scale_factor",0.9996],' +
        'PARAMETER["false_easting",500000],' +
        'PARAMETER["false_northing",0],' +
        'UNIT["metre",1,' +
            'AUTHORITY["EPSG","9001"]],' +
        'AXIS["Easting",EAST],' +
        'AXIS["Northing",NORTH],' +
        'AUTHORITY["EPSG","3067"]]'

    const thing = proj4('EPSG:4326', finnishProjectionWKT1).forward([29.762067322297078, 62.60064557510063]) //[62.60064557510063, 29.762067322297078]
    console.log(thing)
}

/*
'EPSG:3067',
'+title=ETRS89 +proj=eastnorth'

'EPSG:4269',
'+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees'
*/
