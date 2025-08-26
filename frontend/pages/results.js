import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Map = dynamic(() => import('../components/Map'), { ssr: false });
import Recommendation from '../components/Recommendation';

const ResultsComponent = () => {
  const { departure, arrival, datetime } = useRouter().query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (departure && arrival && datetime) {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/flight`, { departure, arrival, datetime })
        .then(res => setData(res.data))
        .catch(err => {
          const msg = err.response?.data?.error || err.message || 'Request failed';
          setError(new Error(msg));
        })
        .finally(() => setLoading(false));
    }
  }, [departure, arrival, datetime]);

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div className="results-container">
      <h1>Oops!</h1>
      <p>{error.message}</p>
      <button onClick={() => {
        setLoading(true);
        setError(null);
        setRetrying(true);
      }}>Try Again</button>
    </div>
  );

  return (
    <div className="results-container">
      <h1>Your Recommendation</h1>
      <Recommendation 
        recommendation={data.recommendation} 
        reason={data.reason}
        confidence={data.confidence}
        flightInfo={data.flightInfo}
        sunInfo={data.sunInfo}
      />
      {data.positions && data.positions.length > 0 && (
        <Map path={data.positions} sunPositions={data.positions} />
      )}
    </div>
  );
}

export default ResultsComponent;
