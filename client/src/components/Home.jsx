import React, { useEffect, useState } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [cvedata, setCveData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cvesPerPage] = useState(10);
    const [pagesDisplayed] = useState(5);
    const [filter, setFilter] = useState({
        cveId: '',
        year: '',
        score: '',
        days: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
      let url = 'http://localhost:3001/cves/list';
      if (filter.cveId) {
          url = `http://localhost:3001/cves/${filter.cveId}`;
      }
      axios.get(url)
          .then(response => {
              if (Array.isArray(response.data)) {
                  setCveData(response.data);
              } else {
                  setCveData([response.data]);
              }
          })
          .catch(err => console.log(err));
  };
  
    const indexOfLastCve = currentPage * cvesPerPage;
    const indexOfFirstCve = indexOfLastCve - cvesPerPage;
    const currentCves = cvedata.slice(indexOfFirstCve, indexOfLastCve);
    const totalPages = Math.ceil(cvedata.length / cvesPerPage);

    const renderPageNumbers = () => {
        const maxPages = Math.min(currentPage + pagesDisplayed - 1, totalPages);
        const startPage = Math.max(1, maxPages - pagesDisplayed + 1);
        return Array.from({ length: maxPages - startPage + 1 }, (_, i) => startPage + i);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    const navigate = useNavigate();
    const handleRowClick = (id) => {
        navigate(`/cve/${id}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    const handleSearch = () => {
        fetchData();
    };

    return (
        <>
            <div className='d-flex justify-content-center align-items-center'>
                <div className='w-75'>
                    <h2 className='text-center mt-3'>CVE LIST</h2>
                    <h4 className='mt-3'>Total Records: {cvedata.length}</h4>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Search by CVE ID" name="cveId" value={filter.cveId} onChange={handleInputChange} />
                        <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
                    </div>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr className="table-secondary">
                                <th className='text-center'>ID</th>
                                <th className='text-center'>Source Identifier</th>
                                <th className='text-center'>Published Date</th>
                                <th className='text-center'>Last Modified</th>
                                <th className='text-center'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCves.map(cve => (
                                <tr key={cve.id} onClick={() => handleRowClick(cve.id)} style={{ cursor: 'pointer' }}>
                                    <td className='text-center'>{cve.id}</td>
                                    <td className='text-center'>{cve.sourceIdentifier}</td>
                                    <td className='text-center'>{formatDate(cve.published)}</td>
                                    <td className='text-center'>{formatDate(cve.lastModified)}</td>
                                    <td className='text-center'>{cve.vulnStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ul className="pagination justify-content-end ">
                        <li className={currentPage === 1 ? "disabled" : ""}>
                            <button onClick={() => setCurrentPage(currentPage - 1)} className="page-link">Previous</button>
                        </li>
                        {renderPageNumbers().map(page => (
                            <li key={page} className={currentPage === page ? "active" : ""}>
                                <button onClick={() => setCurrentPage(page)} className="page-link">{page}</button>
                            </li>
                        ))}
                        <li className={currentPage === totalPages ? "disabled" : ""}>
                            <button onClick={() => setCurrentPage(currentPage + 1)} className="page-link">Next</button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Home;
