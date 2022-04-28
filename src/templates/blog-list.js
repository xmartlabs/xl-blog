import React from "react"
import { graphql, Link } from "gatsby"

const BlogList = ({ pageContext, data }) => {
    const _ = require("lodash")    
    const { edges, totalCount } = data.allMdx
    const { limit, skip, numPages,  currentPage} = pageContext

    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? "/" : `/page/${(currentPage - 1)}`.toString()
    const nextPage = `/page/${(currentPage + 1)}`.toString()
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
                        <Link to={`/${_.kebabCase(node.frontmatter.permalink)}`}>
                            {node.frontmatter.title}
                        </Link>
                        <p>Posted: {node.frontmatter.date}</p>
                        </h2>
                    </article>
                )
            })}
            <>
            {!isFirst && (
                <Link to={prevPage} rel="prev">
                ← Previous Page
                </Link>
            )}
            {!isLast && (
                <Link to={nextPage} rel="next">
                Next Page →
                </Link>
            )}
            </>
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
                        permalink
                    }
                    body
                    slug
                }
            }
        }
    }
`