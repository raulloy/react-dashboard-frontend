import React from 'react';
import { Button } from 'react-bootstrap';

function UpdateButton(props) {
  const { since, setSince, until, setUntil } = props;

  const handleApply = () => {
    // perform setSince and setUntil
    // you can add some validation logic here

    setSince(since);
    setUntil(until);
  };

  return (
    <Button variant="outline-primary" onClick={handleApply}>
      Update
    </Button>
  );
}

export default UpdateButton;
