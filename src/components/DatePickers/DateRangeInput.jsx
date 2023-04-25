import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

function DateRangeInput(props) {
  const { since, setSince, until, setUntil } = props;

  return (
    <Form className="form-transparent">
      <Row>
        <Col
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="my-2"
          style={{ minWidth: '220px' }}
        >
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Desde</InputGroup.Text>
            <Form.Control
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              className="input-transparent"
            />
          </InputGroup>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="my-2"
          style={{ minWidth: '220px' }}
        >
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Text>Hasta</InputGroup.Text>
            <Form.Control
              type="date"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              className="input-transparent"
            />
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default DateRangeInput;
