import { useEffect, useState } from "react";
import { Badge, Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { default as BootstrapTable } from "react-bootstrap/Table";
import "../styles/Table.css";
import FilterForm from "./Table.FilterForm";
import PaginationBar from "./Table.PaginationBar";

/**
 * Table component
 * @param {JSON object array} props.data: An array of data objects (level 1 JSON object) with all the same properties
 * @returns JSX
 */

function Table(props) {
    let [orderedBy, setOrderedBy] = useState(undefined) // Ordering settings
    let template = assertDataFormat(props.data) // Data properties as keys, types and uniqueValues (for Arrays) as values. See function for more info.
    let properties = Object.keys(template) // Data properties
    let [itemPerPage, setItemPerPage] = useState(10)
    let [maxPage, setMaxPage] = useState(Math.ceil(props.data.length / itemPerPage))
    let [page, setPage] = useState(1)

    // Filter parameter
    let _filter = {}
    // Initializing filter values
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        _filter[property] = ""
    }
    // Adding a hook to monitor changes in filter
    let [filter, setFilter] = useState(_filter)



    useEffect(() => {
        let nbItems = getSortedFilteredData().length
        let newMaxPage = Math.ceil(nbItems / itemPerPage)
        setMaxPage(newMaxPage)
        if (page > newMaxPage) {
            setPage(Math.max(newMaxPage, 1))
        }
    }, [filter, itemPerPage])



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
            if (orderedBy.asc === true) { // the ordering is set to ascending
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

    const getSortedFilteredData = function () {
        return [...props.data].sort((a, b) => { // copy the data given to the component to a new object reference
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
                if (property_info.type === "array") {
                    // Checks the row's property value contains ALL selected values in the filter (multielement selector)
                    for (let i = 0; i < filter[property_name].length; i++) {
                        const filterValue = filter[property_name][i];
                        if (!(o[property_name].includes(filterValue))) {
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
        })
    }

    return (
        <Card>
            <CardHeader>
                {/** This is the filter form */}
                <FilterForm
                    template={template}
                    filter={filter}
                    changedFilterValue={changedFilterValue}
                    setItemPerPage={setItemPerPage}
                ></FilterForm>
            </CardHeader>

            <div className="pt-3">
                <PaginationBar setPage={setPage} maxPage={maxPage} currentPage={page}></PaginationBar>
            </div>

            <div className="p-3">
                <BootstrapTable striped bordered hover>
                    <thead>
                        <tr>
                            {properties.map((property_name) => { // For each property extracted from the template
                                return <th className="align-middle" role="button" onClick={(e) => { clickedOrderBtn(property_name) /** Calls the handling function for the ordering button with the name of the property */ }}>
                                    <div className="d-flex justify-content-between">
                                        <div>{property_name}</div>
                                        <div>
                                            {
                                                // displays a button with arrow depending on the ordering state
                                                orderedBy !== undefined && orderedBy.property === property_name ? (orderedBy.asc ? "🠗" : "🠕") : "⇵"
                                            }
                                        </div>
                                    </div>
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (getSortedFilteredData().length === 0) ?
                                (
                                    <tr>
                                        <td colspan="100%" className="text-center">No entries found</td>
                                    </tr>
                                ) : (
                                    getSortedFilteredData().slice((page - 1) * itemPerPage, page * itemPerPage).map((o) => {
                                        // Formats the data to be displayed as a row in the table
                                        return <tr>
                                            {Object.entries(template).map(([property_name, property_info]) => {
                                                if (property_info.type === "array") {
                                                    // joins the array element with commas
                                                    return <td><div className="limit-text-2">{o[property_name].join(", ")}</div></td>
                                                } else {
                                                    let colored = o[property_name]
                                                    if (filter[property_name] !== "") {
                                                        // colors the subsets of characters of the filter value in RED
                                                        let _colored = colored.split(filter[property_name])
                                                        colored = []
                                                        for (let i = 0; i < _colored.length - 1; i++) {
                                                            const element = _colored[i];
                                                            colored.push(<span>{element}<Badge>{filter[property_name]}</Badge></span>)
                                                        }
                                                        colored.push(<span>{_colored[_colored.length - 1]}</span>)
                                                    }
                                                    return <td><div className="limit-text-2">{colored}</div></td>
                                                }
                                            })}
                                        </tr>
                                    })
                                )
                        }
                    </tbody>
                </BootstrapTable>
            </div>
        </Card>
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
        if (Array.isArray(v)) { // if the property's value of the template is an array itself
            let uniqueValues = [] // init
            for (let i = 0; i < data.length; i++) { // for every row
                const element_value = data[i][property]; // take the property's value of the row
                uniqueValues = [...new Set(uniqueValues.concat(element_value))] // merge it to the uniqueValues variable by concatenating them and removing duplicates
            }

            return {
                type: "array",
                uniqueValues: uniqueValues.sort((a, b) => a.localeCompare(b))
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