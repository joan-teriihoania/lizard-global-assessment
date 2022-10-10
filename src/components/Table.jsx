import "./Table.css"

/**
 * Table component
 * @param {JSON object array} data: An array of data objects (level 1 JSON object) with all the same properties
 * @returns JSX
 */
function Table(props){
    try {
        let properties = assertDataFormat(props.data)
        return <table>
            <thead>
                <tr>
                    {properties.map((v) => {
                        return <th>{v}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {props.data.map((o) => {
                    return <tr>
                        {properties.map((property) => {
                            return <td>{o[property]}</td>
                        })}
                    </tr>
                })}
            </tbody>
        </table>
    } catch(e){
        return <div>Invalid data format: {e.message}</div>
    }
}

/**
 * Asserts that the data has a valid format
 * @param {any} data: Any value
 * @returns Template properties
 */
function assertDataFormat(data){
    if(!Array.isArray(data)) throw new Error("Data is not an array")
    if(data.length === 0) return // if no data, nothing to check

    // Gets template properties from first data object in array
    const template_properties = Object.keys(data[0])

    for (let i = 1; i < data.length; i++) {
        const element = data[i];
        const element_properties = Object.keys(element)
        
        // Check that all properties from the data object template are in the object i
        for (let j = 0; j < template_properties.length; j++) {
            const template_property = template_properties[j];

            // If element is missing a template property, throws error
            if(!(element_properties.includes(template_property))){
                throw new Error(`Required property "${template_property}" missing in data object ${i} (${JSON.stringify(element)})`)
            }
        }
    }

    return template_properties
}

export default Table