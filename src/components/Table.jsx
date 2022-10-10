import { useEffect, useState } from "react";
import "./Table.css"

/**
 * Table component
 * @param {JSON object array} props.data: An array of data objects (level 1 JSON object) with all the same properties
 * @returns JSX
 */
function Table(props) {
    let [orderedBy, setOrderedBy] = useState(undefined) // Ordering settings
    let template = assertDataFormat(props.data) // Data properties as keys, types and uniqueValues (for Arrays) as values. See function for more info.
    let properties = Object.keys(template) // Data properties

    // Filter parameter
    let _filter = {}
    // Initializing filter values
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        _filter[property] = ""
    }
    // Adding a hook to monitor changes in filter
    let [filter, setFilter] = useState(_filter)

    /**
     * Handle a click on the ordering button of a column (property)
     */
    const clickedOrderBtn = function (property) {
        if (orderedBy === undefined || orderedBy.property !== property) { // If there was no prior ordering or the ordering was set on a different property than the one selected now
            setOrderedBy({ // Set the ordering to the now selected property in ascending order
                property: property,
                asc: true
            })
        } else { // If the user clicked on the ordering button of the currently ordered property (by it ascending or not)
            if(orderedBy.asc === true){ // the ordering is set to ascending
                setOrderedBy({ // set to descending
                    property: property,
                    asc: false
                })
            } else { // the ordering is set to descending
                setOrderedBy(undefined) // remove all ordering
            }
        }
    }

    /**
     * Handles changes in the filter value of a property and stores it in the filter variable
     */
    const changedFilterValue = function (property, newvalue) {
        let _filter = { ...filter }
        _filter[property] = newvalue
        setFilter(_filter)
    }

    return (
        <div>
            <div>
                {/** This is the filter form */}
                <form>
                    {Object.entries(template).map(([property_name, property_info]) => { // For each property extracted from the template
                        return <div>
                            <label>
                                <span>{property_name}: </span>
                                {
                                    property_info.type !== "array"
                                    // if the property is NOT an array, display a normal text input
                                    ? <input type="text" name={property_name} value={filter[property_name]} onChange={(e) => {
                                        // When changing the input value, calls the handling function with the property name and the new value
                                        changedFilterValue(property_name, e.target.value) }
                                    } />
                                    // else, display a multielement selector with the uniqueValues as options
                                    : (
                                        <select name="property" onChange={(e) => {
                                            // When changing the options, calls the handling function with the property name and the selected options
                                            changedFilterValue(property_name, [...e.target.options].filter((v) => v.selected).map((v) => v.value))
                                        }} multiple>
                                            {property_info.uniqueValues.map((v) => {
                                                return <option value={v}>{v}</option>
                                            })}
                                        </select>
                                    )
                                }
                            </label>
                        </div>
                    })}
                </form>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            {properties.map((property_name) => { // For each property extracted from the template
                                return <th>
                                    {property_name}
                                    <button onClick={(e) => { clickedOrderBtn(property_name) /** Calls the handling function for the ordering button with the name of the property */ }}>
                                        {
                                        // displays a button with arrow depending on the ordering state
                                        orderedBy !== undefined && orderedBy.property === property_name ? (orderedBy.asc ? "🠗" : "🠕") : "⇵"
                                        }
                                    </button>
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {[...props.data].sort((a, b) => { // copy the data given to the component to a new object reference
                            // sorts the objects depending on the ordering state
                            if (orderedBy === undefined) return 0
                            if (orderedBy.asc) {
                                let t = a
                                a = b
                                b = t
                            }

                            return a[orderedBy.property].localeCompare(b[orderedBy.property])
                        }).filter((o) => { // filters the sorted rows depending on the filtering state

                            // For each property in the template
                            for (let j = 0; j < Object.entries(template).length; j++) {
                                const [property_name, property_info] = Object.entries(template)[j];
                                const filter_value = filter[property_name];

                                // if array
                                if(property_info.type === "array"){
                                    // Checks the row's property value contains ALL selected values in the filter (multielement selector)
                                    for (let i = 0; i < filter[property_name].length; i++) {
                                        const filterValue = filter[property_name][i];
                                        if(!(o[property_name].includes(filterValue))){
                                            return false // will be filtered OUT
                                        }
                                    }
                                } else {
                                    if (filter_value === "") continue
                                    if (!(o[property_name].toLowerCase().includes(filter_value.toLowerCase()))) { // if the property value does not contain the property's filter value
                                        return false // will be filtered OUT
                                    }
                                }
                            }
                            return true // will be kept
                        }).map((o) => {
                            // Formats the data to be displayed as a row in the table
                            return <tr>
                                {Object.entries(template).map(([property_name, property_info]) => {
                                    if(property_info.type === "array"){
                                        return <td>{o[property_name].join(", ")}</td>
                                    } else {
                                        return <td>{o[property_name]}</td>
                                    }
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/**
 * Asserts that the data has a valid format and returns information about the data template structure
 * @param {any} data: Any value
 * @returns Template properties
 */
function assertDataFormat(data) {
    if (!Array.isArray(data)) throw new Error("Data is not an array") // the data are rows, so its an array of row
    if (data.length === 0) return // if no data, nothing to check

    // Gets template properties from first data object in array
    const template_properties = Object.keys(data[0]) // Takes the JSON keys of the first data object
    const template_types = Object.entries(data[0]).map(([property, v]) => { // For each property (and its value) of the first data object
        if (Array.isArray(v)){ // if the property's value of the template is an array itself
            let uniqueValues = [] // init
            for (let i = 0; i < data.length; i++) { // for every row
                const element_value = data[i][property]; // take the property's value of the row
                uniqueValues = [...new Set(uniqueValues.concat(element_value))] // merge it to the uniqueValues variable by concatenating them and removing duplicates
            }

            return {
                type: "array",
                uniqueValues: uniqueValues.sort((a,b) => a.localeCompare(b))
            }
        } else {
            return { type: typeof v }
        }
    })

    for (let i = 1; i < data.length; i++) { // for every row
        const element = data[i]; // get the row
        const element_properties = Object.keys(element) // get the keys of the row (its properties)

        // Check that all properties from the data object template are in the row
        for (let j = 0; j < template_properties.length; j++) {
            const template_property = template_properties[j];

            // If element is missing a template property, throws error
            if (!(element_properties.includes(template_property))) {
                throw new Error(`Required property "${template_property}" missing in data object ${i} (${JSON.stringify(element)})`)
            }
        }
    }

    // Builds the template information structure
    let template = {}
    for (let i = 0; i < template_properties.length; i++) {
        const template_property = template_properties[i];
        const template_type = template_types[i];

        template[template_property] = template_type
        // The template will have the template properties as keys and {type: string, uniqueValues?: string[]} as values
    }

    return template
}

export default Table