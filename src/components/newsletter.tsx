import * as React from "react"
import styled from 'styled-components';
import { StaticImage } from "gatsby-plugin-image"
import * as styles from '../css/newsletter.module.css'

export const StyledFooter = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  position: relative;
  height: 38rem;
  background-color: #161616;
  flex-direction: column;
  align-items: center;
`

const NewsLetter = () => (
  <StyledFooter>
    <StaticImage className={styles.newsletterLogo} src="../../static/images/logo.svg" alt="" width={132} height={138}/>
    <div className={styles.newsletterHeader}>Xmartlabs' Newsletter</div>
    <div className={styles.newsletterText}>Subscribe to our newsletter and get updates on AI,</div>
    <div className={styles.newsletterText}>Computer vision as well as mobile and web development</div>
    <form className={styles.form}>
      <input className={styles.input} placeholder="Type your email..." type="text"></input>
      <button className={styles.button}>SUBSCRIBE</button>
    </form>
    <hr className={styles.divider}/>
  </StyledFooter>
)

export default NewsLetter
