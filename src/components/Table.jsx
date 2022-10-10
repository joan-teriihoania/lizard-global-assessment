import { useEffect, useState } from "react";
import "./Table.css"

/**
 * Table component
 * @param {JSON object array} props.data: An array of data objects (level 1 JSON object) with all the same properties
 * @returns JSX
 */
function Table(props) {
    let [orderedBy, setOrderedBy] = useState(undefined)
    let template = assertDataFormat(props.data)
    let properties = Object.keys(template)

    let _filter = {}
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        _filter[property] = ""
    }
    let [filter, setFilter] = useState(_filter)

    const clickedOrderBtn = function (property) {
        if (orderedBy === undefined || orderedBy.property !== property) {
            setOrderedBy({
                property: property,
                asc: true
            })
        } else {
            if(orderedBy.asc === true){
                setOrderedBy({
                    property: property,
                    asc: false
                })
            } else {
                setOrderedBy(undefined)
            }
        }
    }

    const changedFilterValue = function (property, newvalue) {
        let _filter = { ...filter }
        _filter[property] = newvalue
        setFilter(_filter)
    }

    return (
        <div>
            <div>
                <form>
                    {Object.entries(template).map(([property, content]) => {
                        return <div>
                            <label>
                                <span>{property}: </span>
                                {
                                    content.type !== "array"
                                        ? <input type="text" name={property} value={filter[property]} onChange={(e) => { changedFilterValue(property, e.target.value) }} />
                                        : (
                                            <select name="property" onChange={(e) => {changedFilterValue(property, [...e.target.options].filter((v) => v.selected).map((v) => v.value))}} multiple>
                                                {content.uniqueValues.map((v) => {
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
                            {properties.map((v) => {
                                return <th>
                                    {v}
                                    <button onClick={(e) => { clickedOrderBtn(v) }}>
                                        {orderedBy !== undefined && orderedBy.property === v ? (orderedBy.asc ? "🠗" : "🠕") : "⇵"}
                                    </button>
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {[...props.data].sort((a, b) => {
                            if (orderedBy === undefined) return 0
                            if (orderedBy.asc) {
                                let t = a
                                a = b
                                b = t
                            }

                            return a[orderedBy.property].localeCompare(b[orderedBy.property])
                        }).filter((o) => {
                            for (let j = 0; j < Object.entries(template).length; j++) {
                                const [property, content] = Object.entries(template)[j];
                                const filter_value = filter[property];
                                
                                if(content.type === "array"){
                                    for (let i = 0; i < filter[property].length; i++) {
                                        const filterValue = filter[property][i];
                                        if(!(o[property].includes(filterValue))){
                                            return false
                                        }
                                    }
                                } else {
                                    if (filter_value === "") continue
                                    if (!(o[property].toLowerCase().includes(filter_value.toLowerCase()))) {
                                        return false
                                    }
                                }
                            }
                            return true
                        }).map((o) => {
                            return <tr>
                                {Object.entries(template).map(([property, content]) => {
                                    if(content.type === "array"){
                                        return <td>{o[property].join(", ")}</td>
                                    } else {
                                        return <td>{o[property]}</td>
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
 * Asserts that the data has a valid format
 * @param {any} data: Any value
 * @returns Template properties
 */
function assertDataFormat(data) {
    if (!Array.isArray(data)) throw new Error("Data is not an array")
    if (data.length === 0) return // if no data, nothing to check

    // Gets template properties from first data object in array
    const template_properties = Object.keys(data[0])
    const template_types = Object.entries(data[0]).map(([property, v]) => {
        let uniqueValues = []
        for (let i = 0; i < data.length; i++) {
            const element_values = data[i][property];
            uniqueValues = [...new Set(uniqueValues.concat(element_values))]
        }

        if (Array.isArray(v)){
            return {
                type: "array",
                uniqueValues: uniqueValues.sort((a,b) => a.localeCompare(b))
            }
        }
        return { type: typeof v }
    })

    for (let i = 1; i < data.length; i++) {
        const element = data[i];
        const element_properties = Object.keys(element)

        // Check that all properties from the data object template are in the object i
        for (let j = 0; j < template_properties.length; j++) {
            const template_property = template_properties[j];

            // If element is missing a template property, throws error
            if (!(element_properties.includes(template_property))) {
                throw new Error(`Required property "${template_property}" missing in data object ${i} (${JSON.stringify(element)})`)
            }
        }
    }

    let template = {}
    for (let i = 0; i < template_properties.length; i++) {
        const template_property = template_properties[i];
        const template_type = template_types[i];

        template[template_property] = template_type
    }

    return template
}

export default Table