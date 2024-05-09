import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CVEDetails = () => {
    const [cvedetails, setCveDetails] = useState([]);
    const [desc,setDesc] = useState([]);
    const [weak,setWeak] = useState([]);
    const [metrics,setMetrics] = useState([]);
    const [ref,setRef] = useState([])

    const { id } = useParams();
    console.log(id)
    useEffect(() => {
        axios.get(`http://localhost:3001/cves/${id}`)
          .then(cves => {
            setCveDetails(cves.data)
            setDesc(cves.data.descriptions)
            setWeak(cves.data.weaknesses)
            setMetrics(cves.data.metrics.cvssMetricV2[0])
            setRef(cves.data.references)
            console.log(cves.data)
        })
          .catch(err => console.log(err));
      }, [id]);

      useEffect(() => {
        console.log("CVE Details updated:",ref);
    }, [cvedetails]);

  return (
    <div className='mx-5 mt-3 '>

        <h1 className='text-center'>{id}</h1>
        <h4>Description:</h4>
        <p>
        {desc.map((d, index) =>(
                        <div key={index}>{d.value}</div>
                    ))}
        </p>

        <h4>CVSS V2 Metrics:</h4>
        {metrics && metrics.cvssData && (<>
            <div>

            </div>
       
            <div>
            <strong>Severity: </strong><span>{cvedetails.metrics.cvssMetricV2[0].cvssData.accessComplexity}</span>
            &emsp; &emsp;
            <strong>Score: </strong><span className='text-danger'>{cvedetails.metrics.cvssMetricV2[0].cvssData.baseScore}</span>
            </div>
            <div>
                <strong>Vector String: </strong>
                {metrics.cvssData.vectorString}
            </div>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr className='table-secondary'>
                        <th className='text-center'>Access Vector</th>
                        <th className='text-center'>Access Complexity</th>
                        <th className='text-center'>Authentication</th>
                        <th className='text-center'>Confidentiality Impact</th>
                        <th className='text-center'>Integrity Impact</th>
                        <th className='text-center'>Availability Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='text-center'>{metrics.cvssData.accessVector}</td>
                        <td className='text-center'>{metrics.cvssData.accessComplexity}</td>
                        <td className='text-center'>{metrics.cvssData.authentication}</td>
                        <td className='text-center'>{metrics.cvssData.confidentialityImpact}</td>
                        <td className='text-center'>{metrics.cvssData.integrityImpact}</td>
                        <td className='text-center'>{metrics.cvssData.availabilityImpact}</td>
                    </tr>
                </tbody>
            </table>

            <h4 className='mt-3'>Scores:</h4>
            <strong>Exploitability Score: </strong><span>{metrics.exploitabilityScore}</span>
            <div >
                <strong>Impact Score: </strong>
                <span>{metrics.impactScore}</span>
            </div>
            <h4 className='mt-3'>CPE:</h4>
            <table className='table table-bordered  mt-3'>
                <thead>
                    <tr className='table-secondary'>
                        <th className='text-center'>Criteria</th>
                        <th className='text-center'>Match Criteria ID</th>
                        <th className='text-center'>Vulnerable</th>
                    </tr>
                </thead>
                <tbody>
                    <>
                        {cvedetails.configurations[0].nodes[0].cpeMatch.map((data,index) => (
                            <tr key={index}>
                                <td className='text-center'>{data.criteria}</td>
                                <td className='text-center'>{data.matchCriteriaId}</td>
                                <td className='text-center'>{data.vulnerable ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </>
                </tbody>
            </table>
        </>)}
    </div>
  );
};

export default CVEDetails;
