const fs = require('fs')
const dsv = require('d3-dsv')

const placesPath = ('./src/data-preprocessed/places.csv')
const placesContents = fs.readFileSync(placesPath, 'utf8')
const placesData = dsv.csvParse(placesContents)

const requiredColumns = [
  'Place',
  'Latitude',
  'Longitude',
  'Weight',
//  'Team',
  'Content',
  'Comments',
  'Related',
//  'Type',
  'Negative',
  'Postive',
  'Neutral',
  'Topographical features',
  'Topographical features (general)'
]

const validator = {
  errors: [],
  assert(valid, message) {
  	if (!valid) this.errors.push(message)
  }
}

requiredColumns.forEach(columnName => validator.assert(placesData.columns.includes(columnName), `${placesPath}: Column "${columnName}" misssing.`) )

placesData.forEach((row, index) => {
  	// validate columns that can't be empty strings
  	const stringColumns = ['Place', 'Content', 'Comments']
  	stringColumns.forEach(columnName => validator.assert(row[columnName] && row[columnName].length > 0, `${placesPath} row ${index + 1}: Column "${columnName}" is empty.`))

  	// validate coordinates
  	const coordinateColumns = ['Latitude', 'Longitude']
  	coordinateColumns.forEach(columnName => {

  	   // must be parseable as float
  	   const value = row[columnName]
  	   const floatValue = parseFloat(value)
  	   validator.assert(!isNaN(floatValue), `${placesPath} row ${index + 1}: ${columnName} is missing or not a valid floating point number ("${value}").`)

  	   // must be a valid geo-coordinate
  	   // validator.assert(floatValue <= 90 && floatValue >= -90, `${placesPath} row ${index + 2}: ${columnName} is not a valid geo coordinate (must be between -90 and 90).`)
  	})

  	// validate passages ("Content") column
  	// must match regex ([\s\S]*?)"\s+\((.*?)\)\s+\[(.*?)\];?
  	// https://blog.mastykarz.nl/regular-expressions-in-javascript-dont-support-the-single-line-mode/
  	// https://regex101.com/r/zACvGs/1

  	const passageRegex = new RegExp("\\\"([\\s\\S]*?)\\\"\\s+\\((.*?)\\)\\s+\\[(.*?)\\];?", "g")
  	const passagesValue = row['Content']
  	const parsedPassages = []

  	let numMatches = 0
  	while ((match = passageRegex.exec(passagesValue)) !== null) {
  		numMatches++
  	}

  	validator.assert(numMatches > 0, `${placesPath} row ${index + 1} (${row['Place']}): Could not parse passages. The "Passages" column must contain one or more strings, seperated by "/", matching the pattern: "passage text" (reference) [morality]`)
})

if (validator.errors.length > 0) {
	console.log("\x1b[31m\x1b[1mData validation failed. Errors:\x1b[0m")
	validator.errors.forEach(error => console.log(`\x1b[31m✗\x1b[0m ${error}`))
	process.exit(1);
}
