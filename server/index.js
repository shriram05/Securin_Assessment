import fetch from "node-fetch";
import mongoose from "mongoose";
import CVE from "./model.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/securindb");

async function fetchdata() {
    try {
        const batchSize = 2000;
        const totalRecords = 248594;
        
        for (let i = 0; i < totalRecords; i += batchSize) {
            const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${i}&resultsPerPage=${batchSize}`;
            console.log("Fetching data from:", url);
            
            const response = await fetch(url);
            const responseData = await response.json(); 
            const vulnerabilities = responseData.vulnerabilities;

            for (const vulnerability of vulnerabilities) {
                const cveId = vulnerability.cve.id;
                const existingCVE = await CVE.findOne({ id: cveId });

                if (existingCVE) {
                    console.log(`CVE entry ${cveId} already exists in the database. Skipping insertion.`);
                } else {
                    const cveEntry = new CVE(vulnerability.cve);
                    await cveEntry.save();
                    console.log(`CVE entry ${cveId} inserted successfully`);
                }
            }
        }
    } catch (error) {
        console.error("Error fetching and saving data:", error);
    }
}


//fetchdata();

app.get("/cves/list", async (req, res) => {
    try {
        const { id } = req.query;
        if (id) {
            const cve = await CVE.findOne({ id });
            if (cve) {
                res.json([cve]); 
            } else {
                res.status(404).json({ error: "CVE not found" });
            }
        } else {
            const cves = await CVE.find();
            res.json(cves);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/cves/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const document = await CVE.findOne({ id });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(document);
        console.log(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3001, () => {
    console.log("server is running");
});
