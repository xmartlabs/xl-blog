import React from "react";

import { TopPostHome } from "../top-post-home/top-post-home";

const TopThreePosts = ({ edges }) => {

  return (
    <div>
      {edges.slice(0, 3).map(({node}) => <TopPostHome data={node} key={node.id}/>)}

    </div>
  );
};

export { TopThreePosts };
