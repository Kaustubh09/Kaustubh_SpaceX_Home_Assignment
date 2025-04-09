//imports
import { Inter, Mooli, Roboto, Titillium_Web } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

// component imports
import Image from "next/image";
import Head from "next/head";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] });
const titillium = Titillium_Web({ subsets: ["latin"], weight: "600" });

export default function Home() {
	const [apiData, setApiData] = useState([]);

	// API fetch logic
	useEffect(() => {
		const queryOptions = {
			select: "id name date_utc success upcoming details failures links",
			sort: "date_utc",
			limit: 150,
		};
    // fetch data from API
    const getlaunchData = async () => {
			try {
				const url = "https://api.spacexdata.com/v5/launches/query";
				const response = await axios.post(url, {
					options: queryOptions,
				});


        // Store response locally, use the docs node
				setApiData(response.data.docs);
			} catch (error) {
				console.error(error);
			}
		};
    // Call the API
		getlaunchData();
	}, []);

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name='description' content='space x monitor' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' href='/favicon.ico' />
			</Head>
			<header className={`${styles.header} ${roboto.className} `}>
				<h1 className={styles.header__title}>Space X Launch Tracker </h1>
			</header>
			<main className={`${styles.main} ${roboto.className}`}>
        {function() {

          const renderCards = apiData.map(launch => {
// console.log(launch.name)
// console.log(launch.details)

            const formatedDate = date => {
               return date.slice(0, 10).split("-").reverse().join("-");
            };

            const status = launch.success ? "success" : "failure";
            return (
             <>
              <article key={launch.id} className={styles.launch_card}>
                <Image
                  className={styles.img}
                  src={launch.links.patch.small}
                  alt='Rocket Patch'
                  width={200}
                  height={200}
              />
                <h2>{launch.name} </h2>
                <div className={styles.card__content}>
                  <p>Date : {formatedDate(launch.date_utc)} </p>
                  <p>Launch Status: {status}</p>
                  <p>{launch.details} </p>
                  {!launch.success && (<p>Failure Reason : {launch.failures[0].reason}</p>)}
                </div>
              </article>
            </>
          );
        })

        return (
          <>
            <section role="card-container" className={styles.main__section}>
            {renderCards}
            </section>
          </>
        );
      }()}
			</main>
		</>
	);
}
