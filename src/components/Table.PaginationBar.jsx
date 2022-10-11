import { Button, ButtonGroup, Container, Form } from "react-bootstrap";
import "../styles/Table.css";

/**
 * Table component
 * @param {JSON object array} props.data: An array of data objects (level 1 JSON object) with all the same properties
 * @returns JSX
 */

function PaginationBar(props) {
    let setPage = props.setPage
    let maxPage = props.maxPage
    let page = props.currentPage

    // Generates buttons for the pagination bar
    // first part of the bar to display the first three pages (or lower depending on the maximum page)
    let paginationFirst = []
    let pagFirstMin = 1
    let pagFirstMax = Math.min(maxPage, 3)
    for (let i = pagFirstMin; i <= pagFirstMax; i++) {
        paginationFirst.push(<Button onClick={(e) => { setPage(i) }} disabled={page === i}>{i}</Button>)
    }

    // last part of the bar to display the last three pages
    let paginationLast = []
    let pagLastMin = Math.max(maxPage - 2, 4)
    let pagLastMax = maxPage
    for (let i = pagLastMin; i <= pagLastMax; i++) {
        paginationLast.push(<Button onClick={(e) => { setPage(i) }} disabled={page === i}>{i}</Button>)
    }

    // middle part of the bar to display the two pages before and after the currently displayed page
    // with logic to prevent it from conflicting with the first and last part of the pagination bar
    let paginationMiddle = []
    let pagMiddleMin = Math.max(4, page - 1)
    let pagMiddleMax = Math.min(maxPage - 2, page + 2)
    for (let i = pagMiddleMin; i < pagMiddleMax; i++) {
        paginationMiddle.push(<Button className="bg-warning" onClick={(e) => { setPage(i) }} disabled={page === i}>{i}</Button>)
    }


    return (
        <Form>
            <Container className="pb-3" fluid>
                <center>
                    {/** goes back a page, except when we are at the first page */}
                    <Button className="me-2" onClick={(e) => { setPage(page - 1) }} disabled={page === 1}>🠔</Button>

                    {/** adds or removes "..." between each section of the pagination bar depending on the currently displayed page and the maximum page */}
                    <ButtonGroup className="me-2">
                        {paginationFirst}
                        {pagFirstMax + 1 === pagMiddleMin || paginationMiddle.length === 0 ? "" : (<Button disabled>...</Button>)}
                        {paginationMiddle}
                        {pagMiddleMax === pagLastMin || paginationMiddle.length === 0 ? "" : (<Button disabled>...</Button>)}
                        {paginationLast}
                    </ButtonGroup>

                    {/** goes up a page, except when we are at the last page */}
                    <Button className="me-2" onClick={(e) => { setPage(page + 1) }} disabled={page === maxPage}>➝</Button>
                </center>
            </Container>
        </Form>
    )
}

export default PaginationBar