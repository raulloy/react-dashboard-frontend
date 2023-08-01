import React from 'react';
import { Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';

export const DesarrolloDropdown = (props) => {
  const { accounts, selectedAccount, setSelectedAccount } = props;

  return (
    <div className="date-dropdown-container">
      <Form className="form-transparent">
        <Row>
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

export default DesarrolloDropdown;
