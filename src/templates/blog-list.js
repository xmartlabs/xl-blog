import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../layouts/layout"


const BlogList = ({ pageContext, data }) => {
    const { edges, totalCount } = data.allMdx
    const { limit, skip } = pageContext
    return (
        <>
            <h1>Limit: {limit}</h1>
            <h1>Skip: {skip}</h1>
            <h1>Edges Count: {edges.length}</h1>
            <h1>TOTAL COUNT: {totalCount}</h1>
            {edges.map(({ node }) => {
                return (
                    <article key={node.id}>
                        <h2>
                        <Link to={`${ node.slug }`}>
                            {node.frontmatter.title}
                        </Link>
                        <p>Posted: {node.frontmatter.date}</p>
                        </h2>
                    </article>
                )
            })}
        </>
    )
}

export default BlogList

export const blogListQuery = graphql`
    query blogListQuery($skip: Int!, $limit: Int!) {
        allMdx(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: $limit
        skip: $skip
        ) {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        date(formatString: "MMMM D, YYYY")
                        title
                        author
                        category
                        tags
                    }
                    body
                    slug
                }
            }
        }
    }
`