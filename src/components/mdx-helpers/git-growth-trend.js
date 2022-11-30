import React from "react"
import Helmet from "react-helmet"

const GitGrowthTrend = ({ children }) => (
  <Helmet>
    {/* <script src={withPrefix('identity.js')} type="text/javascript"></script> */}
    <script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/2213_RC01/embed_loader.js"></script> 
    <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"/m/05vqwg","geo":"","time":"2010-01-01 2020-06-04"},{"keyword":"/m/0dzxs","geo":"","time":"2010-01-01 2020-06-04"}],"category":0,"property":""}, {"exploreQuery":"date=2010-01-01%202020-06-04&q=%2Fm%2F05vqwg,%2Fm%2F0dzxs","guestPath":"https://trends.google.com:443/trends/embed/"}); 
    </script>
  </Helmet>
)

export default GitGrowthTrend

