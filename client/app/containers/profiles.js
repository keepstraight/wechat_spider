import React from 'react';
import { connect } from 'react-redux';
import { fetchProfiles } from '../actions';
import Loading from '../components/loading';
import moment from 'moment';
import Paginator from '../components/Paginator';
import { Link } from 'react-router';

class Profiles extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { dispatch, location } = this.props;
    dispatch(fetchProfiles(location.query));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      let { dispatch } = this.props;
      dispatch(fetchProfiles(nextProps.location.query));
    }
  }

  render() {
    let { isFetching, profiles, history, location } = this.props;
    let { search, pathname } = location;
    if (isFetching || !profiles.data) return <Loading />;
    let metadata = profiles.metadata;
    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>更新时间</th>
              <th>头像</th>
              <th>公众号</th>
              <th>文章数</th>
              <th>有数据</th>
              <th>差</th>
              <th>MsgBiz</th>
            </tr>
          </thead>
          <tbody>
            {
              profiles.data.map(profile => {
                return (
                  <tr key={profile._id}>
                    <td>{profile.openHistoryPageAt ? moment(profile.openHistoryPageAt).format('YY-MM-DD HH:mm') : ''}</td>
                    <td><img style={{ height: '24px', marginRight: '3px' }} src={profile.headimg} className="img-circle" /></td>
                    <td><Link to={`/posts?msgBiz=${profile.msgBiz}`}>{profile.title}</Link></td>
                    <td>{profile.postsAllCount}</td>
                    <td>{profile.postsHasDataCount}</td>
                    <td>{profile.postsAllCount - profile.postsHasDataCount}</td>
                    <td>{profile.msgBiz}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <Paginator { ...metadata } history={ history } search={ search } pathname={ pathname } ></Paginator>
      </div>
    )
  }
}

export default connect(state => state)(Profiles);