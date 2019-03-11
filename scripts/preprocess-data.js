const XLSX = require('xlsx');
const stripBom = require('strip-bom');
const fs = require('fs')

try {
    const workbook = XLSX.readFile('./data/Paradise_Lost-all.xlsx');

    //XLSX.writeFile(workbook, './src/data-preprocessed/places.csv');
    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]], {blankrows: false})
    const csvWithoutBOM = stripBom(csv)

    fs.writeFile('./src/data-preprocessed/places.csv', csvWithoutBOM, null, (err) => {
        if (err) {
            throw err
        } else {
            console.log("Wrote places.csv")
        }
    })


    fs.copyFile('./data/bible.csv', './src/data-preprocessed/bible.csv', (err) => {
        if (err) throw err
        console.log("Wrote bible.csv")
    })

    fs.copyFile('./data/MappableGenesis_2018.csv', './src/data-preprocessed/MappableGenesis_2018.csv', (err) => {
        if (err) throw err
        console.log("Wrote MappableGenesis_2018.csv")
    })

} catch (err) {
    if (err.code === 'ENOENT') {
        console.log("ERROR: could not open file")
        console.log(err.message)
    } else {
        throw err
    }
}
