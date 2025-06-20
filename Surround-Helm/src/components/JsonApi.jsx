import React, { useContext, useEffect } from "react";
import productContext from "../context/ProductContext";

const JsonApi = () => {
  const context = useContext(productContext);
  const { fetchUser, jsonApiData } = context;
  
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div>
        <h1>this is for fetching the Json APIs</h1>
        {jsonApiData ? (
          <div>
            <h2>API OUTCOME: {jsonApiData.title}</h2>
            <p>User ID: {jsonApiData.userId}</p>
            <p>Completed: {jsonApiData.completed ? "Yes" : "No"}</p>
            <p>ID: {jsonApiData.id}</p>
          </div>
        ) : (
          <p>Loading JSON API data...</p>
        )}
      </div>
    </>
  );
};

export default JsonApi;
