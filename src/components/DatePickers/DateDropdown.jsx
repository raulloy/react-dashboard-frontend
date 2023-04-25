import React from 'react';
import {
  Col,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';

export const DateDropdown = (props) => {
  const {
    since,
    setSince,
    until,
    setUntil,
    accounts,
    selectedAccount,
    setSelectedAccount,
  } = props;

  return (
    <div className="date-dropdown-container">
      <Form className="form-transparent">
        <Row>
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="my-2"
            style={{ minWidth: '200px' }}
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
            style={{ minWidth: '200px' }}
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
          <Col>
            <div className="dropdown-button">
              <DropdownButton
                id="dropdown-basic-button"
                title={`${
                  accounts.find((account) => account.id === selectedAccount)
                    ?.name
                }`}
              >
                {accounts.map((account) => (
                  <Dropdown.Item
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                  >
                    {account.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DateDropdown;
