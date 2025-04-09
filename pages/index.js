// pages/index.js

import { useEffect, useState, useMemo } from "react";
import { Roboto } from "next/font/google";
import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

// Import the pagination helper
import { paginate } from "@/utils/pagination";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] });

export default function Home() {
  // API data state and pagination state initialization.
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Display 10 launches per page.

  // API fetch using useEffect (runs once on component mount).
  useEffect(() => {
    const queryOptions = {
      select: "id name date_utc success upcoming details failures links",
      sort: "date_utc",
      limit: 150,
    };

    const getLaunchData = async () => {
      try {
        const url = "https://api.spacexdata.com/v5/launches/query";
        const response = await axios.post(url, {
          options: queryOptions,
        });
        // Store fetched docs.
        setApiData(response.data.docs);
      } catch (error) {
        console.error(error);
      }
    };

    getLaunchData();
  }, []);

  // Calculate total pages.
  const totalPages = Math.ceil(apiData.length / itemsPerPage);

  // Memoize the data slice for the current page using our paginate helper.
  const currentData = useMemo(() => {
    return paginate(apiData, currentPage, itemsPerPage);
  }, [apiData, currentPage]);

  // Render the launch cards based on the current page's data.
  const renderCards = currentData.map((launch) => {
    // Helper function to reformat date (DD-MM-YYYY).
    const formatDate = (date) =>
      date.slice(0, 10).split("-").reverse().join("-");
    
    const status = launch.success ? "success" : "failure";

    return (
      <article key={launch.id} className={styles.launch_card}>
        <Image
          className={styles.img}
          src={launch.links.patch.small}
          alt="Rocket Patch"
          width={200}
          height={200}
        />
        <h2>{launch.name}</h2>

        <div className={styles.card__content}>
          <p>
            <strong>Date:</strong> {formatDate(launch.date_utc)}
          </p>
          <p>
            <strong>Launch Status:</strong>{" "}
            <span className={`${styles.status_badge} ${styles[status]}`}>
              {status}
            </span>
          </p>
          {launch.details && <p> {launch.details}</p>}
          {!launch.success && launch.failures.length > 0 && (
            <p className={styles.failure_reason}>
              <strong>Failure Reason:</strong> {launch.failures[0].reason}
            </p>
          )}
        </div>
      </article>
    );
  });

  // Page change handler to update the currentPage state.
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Head>
        <title>SpaceX Launch Tracker</title>
        <meta name="description" content="space x monitor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={`${styles.header} ${roboto.className}`}>
        <h1 className={styles.header__title}>Space X Launch Tracker</h1>
      </header>
      <main className={`${styles.main} ${roboto.className}`}>
        <section role="card-container" className={styles.main__section}>
          {renderCards}
        </section>
        {/* Pagination Controls */}
        <section className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={currentPage === pageNumber ? styles.activePage : ""}
              >
                {pageNumber}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </section>
      </main>
    </>
  );
}
