import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"

import { CentralColumn, Heading } from "./styles"

const HeaderStyle = styled.header`
  background: rebeccapurple;
`

const Header = ({ siteTitle }) => (
  <HeaderStyle>
    <CentralColumn style={{ height: "100%" }}>
      <Heading style={{ lineHeight: "70px" }}>
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
