import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from '../css/newsletter.module.css'

const NewsLetter = () => (
  <div className={styles.container}>
    <StaticImage className={styles.newsletterLeftDecoration} src="../../static/images/asterisc.png" alt="" width={132} height={138}/>
    <StaticImage className={styles.newsletterLogo} src="../../static/images/xl-logo.svg" alt="" width={132} height={138}/>
    <StaticImage className={styles.newsletterRightDecoration} src="../../static/images/star.png" alt="" width={132} height={138}/>
    <div className={styles.newsletterHeader}>Xmartlabs' Newsletter</div>
    <div className={styles.newsletterText}>Subscribe to our newsletter and get updates on AI,</div>
    <div className={styles.newsletterText}>Computer vision as well as mobile and web development</div>
    <form className={styles.form}>
      <input className={styles.input} placeholder="Type your email..." type="text"></input>
      <button className={styles.button}>SUBSCRIBE</button>
    </form>
    <hr className={styles.divider}/>
  </div>
)

export default NewsLetter
