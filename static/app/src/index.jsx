import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, TextField } from '@material-ui/core';
import styles from './index.css';

window.onload = () => {
  ReactDOM.render(
    <Section>
      <Grid container xs={12} className={styles.container}>
        <Slider />
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
    <Grid container item xs={12} className={styles.slideContainer}>
      <div className={styles.slideSubContainer} style={{ transform: `translateX(${-slideIdx * 100}%)` }}>
        <div className={styles.slidePage}>1</div>
        <div className={styles.slidePage}>2</div>
        <div className={styles.slidePage}>3</div>
        <div className={styles.slidePage}>4</div>
        <div className={styles.slidePage}>5</div>
      </div>
    </Grid>
  );
};

const Section = ({ children }) => {
  return (
    <section className={styles.container}>{ children }</section>
  )
};
