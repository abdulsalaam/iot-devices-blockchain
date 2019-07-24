import DeviceManager, { getDefaultAccount } from '../DeviceManager';
import ethUtil from 'ethereumjs-util';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tag, Card, Input, Divider, Timeline, message } from 'antd';

const Search = Input.Search;

const eventsToSave = ['EntityDataUpdated', 'DeviceCreated', 'DeviceTransfered', 'DeviceSigned'];

class LookupEntity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchValue: '',
      address: this.props.match.params.address,
      data: [],
      searched: false
    }

    this.lookupEntity = this.lookupEntity.bind(this);
  }

  async componentWillMount() {
	let defaultAccount = await getDefaultAccount();
    const { address } = this.state;
    if (address != null) {
      this.reloadWithAddress(address);
    }
	this.setState({
      defaultAccount: defaultAccount
    })
	
  }

  reloadWithAddress(address) {
    this.setState({
      searchValue: address
    })
    this.lookupEntity(address);
  }

  async lookupEntity(address) {
    if (!ethUtil.isValidAddress(address)) {
      message.error('Invalid entity address.');
      return;
    }

    this.setState({
      loading: true
    });

    try {
      let instance = await DeviceManager;

    let filter = {  'owner': address}
	/*instance.events.allEvents({
		  fromBlock: 0
		}, function (error, event) {
		  if (error) console.log('eeeeeeeeeeeeeeeeeee:',error)
		console.log('events:',event)
		console.log('address:',address)
	     //let filteredData = (eventsToSave.includes(event) && (event.address === address));
		 let filteredData = event;
		 console.log('filteredData1:',filteredData)
	
			/*this.setState({
				address: address,
				loading: false,
				searched: true
			  })*/
		 
		/*})*/
		
		//var pastTransferEvents = instance.getPastEvents('EntityDataUpdated', { filter, fromBlock: 0, toBlock: 'latest'})
		instance.getPastEvents('EntityDataUpdated', {
			filter,
			fromBlock: 0,
			toBlock: 'latest'
		}, (error, events) => { 
		console.log('pastTransferEvents:',events); 
		this.setState({
				address: address,
				loading: false,
				 data: events,
				searched: true
			  })
		})
		
		.then((events) => {
			console.log(events) // same results as the optional callback above
			
		});
		//console.log('pastTransferEvents',pastTransferEvents)
		console.log('aaaaaaaaaaaaaaa',this.state.data)
      /*let allEvents = instance.allEvents({ fromBlock: 0, toBlock: 'latest' });
      allEvents.get((error, logs) => {
        let filteredData = logs.filter(el => eventsToSave.includes(el.event) && (el.returnValues.owner === address || el.returnValues.oldOwner === address || el.returnValues.newOwner === address || el.returnValues.signer === address));
        if (!error) {
          this.setState({
            address: address,
            data: filteredData,
            loading: false,
            searched: true
          })
        }
      });*/
    } catch (error) {
      console.log(error);
      message.error(error.message);
    };
  }

  render() {
    return (
      <div>
        <p>
          Search for any entity.
        </p>
        <Search
          placeholder="Input address"
          onSearch={value => this.lookupEntity(value)}
          size="large"
          enterButton
          value={this.state.searchValue}
          onChange={(e) => this.setState({ searchValue: e.target.value })}
        />
        <br /><br />
        <Button size="small" onClick={() => this.setState({ searchValue: this.state.defaultAccount })}>Set to my address</Button>
        {this.state.searched &&
          <div>
            <Divider />
            <Card loading={this.state.loading} title={'Historical events for entity (oldest to newest)'}>
              {this.state.data.length !== 0 ?
                <div>
                  <p style={{ marginBottom: '20px' }}>Events that are filtered are {eventsToSave.join(', ')}</p>
                  <Timeline style={{ marginTop: '10px' }}>
                    {
				    this.state.data.map((el, key) => {
                      if (el.event === 'EntityDataUpdated')
						return <Timeline.Item key={key}>Entity data updated to <code>{el.returnValues.newData}</code></Timeline.Item>
                      if (el.event === 'DeviceCreated')
                        return <Timeline.Item color='green' key={key}>Created device with &nbsp;<Link to={"/manage-device/" + el.returnValues.deviceId.toNumber()}><Tag>ID {el.returnValues.deviceId.toNumber()}</Tag></Link>, identifier <code>{el.returnValues.identifier}</code>, metadata hash <code>{el.returnValues.metadataHash}</code> and firmware hash <code>{el.returnValues.firmwareHash}</code></Timeline.Item>
                      if (el.event === 'DeviceTransfered')
                        return <Timeline.Item color='orange' key={key}>Device with &nbsp;<Link to={"/manage-device/" + el.returnValues.deviceId.toNumber()}><Tag>ID {el.returnValues.deviceId.toNumber()}</Tag></Link>transfered {el.returnValues.newOwner === this.state.address && <span>from &nbsp;<Tag onClick={() => this.reloadWithAddress(el.returnValues.oldOwner)}>{el.returnValues.oldOwner}</Tag></span>}{el.returnValues.oldOwner === this.state.address && <span>to &nbsp;<Tag onClick={() => this.reloadWithAddress(el.returnValues.newOwner)}>{el.returnValues.newOwner}</Tag></span>}</Timeline.Item>
                      if (el.event === 'DeviceSigned')
                        return <Timeline.Item color='purple' key={key}>Signed device with &nbsp;<Link to={"/manage-device/" + el.returnValues.deviceId.toNumber()}><Tag>ID {el.returnValues.deviceId.toNumber()}</Tag></Link></Timeline.Item>
                      else
                        return null
                    })
					}
                  </Timeline>
                </div>
                :
                <p><em>empty</em></p>
              }
            </Card>
          </div>
        }
      </div>
    )
  }
}

export default LookupEntity;