import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Paper, TextField } from '@material-ui/core';
import styles from './index.css';

window.onload = () => {
  ReactDOM.render(
    <Section>
      <Grid container xs={12} className={styles.container}>
        <Grid container item xs={12} className={styles.slideContainer}>
          <Slider />
          <ResultPanel query="forward"/>
        </Grid>
        <Grid container item xs={12} justify="center" alignItems="center" className={styles.formContainer}>
          <Grid container item xs={12} md={8} justify="center" alignItems="center">
            <TextField
              label="Search"
              placeholder="type a vocabulary here"
              fullWidth
              margin="dense"
              variant="outlined"
            />
          </Grid>
          <Grid container item xs={12} md={2} justify="center" alignItems="center">
            <Button variant="contained" color="secondary" size="large">
              Submit
            </Button>
          </Grid>
          <Grid container item xs={12} md={2} justify="center" alignItems="center">
            <Button variant="contained" color="secondary" size="large">
              Reset
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Section>,
    window.document.getElementById('root'),
  );
};

const Slider = () => {
  const [slideIdx, setSlideIdx] = React.useState(0);
  const counter = () => setSlideIdx((slideIdx + 1) % 5);
  React.useEffect(() => {
    const timer = setInterval(counter, 3000);
    return () => clearInterval(timer);
  });

  return (
    <div className={styles.slideSubContainer} style={{ transform: `translateX(${-slideIdx * 100}%)` }}>
      <SlidePage/>
      <SlidePage/>
      <SlidePage/>
      <SlidePage/>
      <SlidePage/>
    </div>
  );
};

const Section = ({ children }) => {
  return (
    <section className={styles.container}>{ children }</section>
  )
};

const ResultPanel = ({ query }) => {
  const [isShow, setShowResult] = React.useState(true);
  const [result, setResult] = React.useState('No results.');
  fetch(`http://127.0.0.1:8000/q/?word=${query}`, {
    method: 'GET',
  })
  .then(response => response.text())
  .then(data => {
    setResult(data)
  });
  return (
    <div className={`${styles.results} ${isShow ? '' : styles.hidePanel}`}>
      <Paper elevation={3}>
        <div className={styles.panelContent}>{result}</div>
      </Paper>
    </div>
  );
};

const SlidePage = () => {
  return (
    <div className={styles.slidePage}>
      <img src="https://linggle.com/static/img/linggle-logo.png" alt=""/>
    </div>
  );
};
