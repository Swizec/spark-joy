import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { Flex, Heading } from "rebass"

import { CentralColumn } from "./styles"
import { UserHeader } from "../components/User"

const HeaderStyle = styled.header`
  background: rebeccapurple;
`

const Header = ({ siteTitle }) => (
  <HeaderStyle>
    <CentralColumn style={{ height: "100%" }}>
      <Flex>
        <Heading style={{ lineHeight: "70px" }} width={2 / 3}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </Heading>

        <UserHeader />
      </Flex>
    </CentralColumn>
  </HeaderStyle>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
