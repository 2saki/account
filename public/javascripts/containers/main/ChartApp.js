import { connect } from 'react-redux'
import Chart from '../../components/main/Chart'

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

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
