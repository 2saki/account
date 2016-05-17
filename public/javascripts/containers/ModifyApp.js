import { connect } from 'react-redux'
import Modify from '../components/Modify'

const mapStateToProps = (state) => {
  return {
    property: state.property
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modify);
