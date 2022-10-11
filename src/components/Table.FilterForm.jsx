import { Col, Container, Form, FormGroup, Row } from "react-bootstrap";
import "../styles/Table.css";

/**
 * Table component
 * @param {JSON object array} props.data: An array of data objects (level 1 JSON object) with all the same properties
 * @returns JSX
 */

function FilterForm(props) {
    let template = props.template
    let filter = props.filter
    let changedFilterValue = props.changedFilterValue
    let setItemPerPage = props.setItemPerPage

    return (
        <Form>
            <Row>
                {Object.entries(template).map(([property_name, property_info]) => { // For each property extracted from the template
                    return <Col sm={12} md={6} lg={4}>
                        <FormGroup>
                            <Form.Label>
                                <Form.Text>{property_name}: </Form.Text>
                            </Form.Label>
                            {
                                property_info.type !== "array"
                                    // if the property is NOT an array, display a normal text input
                                    ? <Form.Control type="text" name={property_name} value={filter[property_name]} onChange={(e) => {
                                        // When changing the input value, calls the handling function with the property name and the new value
                                        changedFilterValue(property_name, e.target.value)
                                    }
                                    } />
                                    // else, display a multielement selector with the uniqueValues as options
                                    : (
                                        <Form.Select onChange={(e) => {
                                            // When changing the options, calls the handling function with the property name and the selected options
                                            changedFilterValue(property_name, [...e.target.options].filter((v) => v.selected).map((v) => v.value))
                                        }} multiple>
                                            {property_info.uniqueValues.map((v) => {
                                                return <option value={v}>{v}</option>
                                            })}
                                        </Form.Select>
                                    )
                            }
                        </FormGroup>
                    </Col>
                })}
            </Row>

            <hr></hr>

            <Row>
                <Container className="pb-3" fluid>
                    <Form.Label>
                        <Form.Text>Item per page</Form.Text>
                    </Form.Label>
                    <Form.Select onChange={(e) => {
                        setItemPerPage(e.target.value)
                    }}>
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10} selected>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Form.Select>
                </Container>
            </Row>
        </Form>
    )
}

export default FilterForm