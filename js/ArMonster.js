'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroPortalScene,
  ViroNode,
  ViroText,
  ViroFlexView,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroConstants,
  ViroDirectionalLight,
  ViroBox,
  ViroARPlaneSelector,
  ViroARPlane,
  ViroMaterials,
  ViroQuad,
  ViroPortal,
  Viro360Image
} from 'react-viro';

import { SnowEmitter, FireworkEmitter } from './particleEmitters'

export default class ArMonster extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      currentEffect: 0,
      modelsCounter: 0,
      modelArray: []
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
  }

  getEffect(){
    if (this.state.currentEffect == 0){
      return this.getSnow();
    } else if (this.state.currentEffect == 1){
      return this.getFireworks();
    }
    
  }

  getFireworks(){
    return(
      <FireworkEmitter
        loop={true}
        run={true}
        explosionLocation={[0,5,-8]}
        explosionSize={6.0}
        explosionDelay={1000}
        startColor={"#ff2d2d"}
        endColor={"#42ff42"}  />
    );
  }

  getSnow(){
    return (
      <SnowEmitter
        run={true}
        emissionArea={[20, 20]}
        emissionHeight={4.5}
        snowRate={1.0}
        fallSpeed={1.0}
        windShear={1.0} />
    );
  }

  getPortal(anchor){
    return (
      <ViroARPlane anchorId={anchor.anchorId}>
        <ViroNode key="portal">
          <ViroPortalScene 
            passable={true} dragType="FixedDistance" onDrag={()=>{}}>
            <ViroPortal 
              scale={[.5, .5, .5]}
            >
                <Viro3DObject
                  source={require('./res/viro_objects_portals/portal_wood_frame/portal_wood_frame.vrx')}
                  resources={[require('./res/viro_objects_portals/portal_wood_frame/portal_wood_frame_diffuse.png'),
                              require('./res/viro_objects_portals/portal_wood_frame/portal_wood_frame_normal.png'),
                              require('./res/viro_objects_portals/portal_wood_frame/portal_wood_frame_specular.png')]}
                  type="VRX"/>
              </ViroPortal>
            <Viro360Image source={require("./res/wakanda_360.jpg")} />
          </ViroPortalScene>
        </ViroNode>
      </ViroARPlane>
    )
  }

  getMonster(anchor){
    return (
      <ViroARPlane anchorId={anchor.anchorId}>
        <ViroNode key="monster"
          dragType="FixedToWorld">
          <Viro3DObject
            source={require('./res/monster.vrx')}
            resources={[
              require('./res/Mutant_diffuse.png'),
              require('./res/Mutant_normal.png')
            ]}
            onLoadEnd={() => {
              this.arSelectorRef.reset()
            }}
            scale={[0.01, 0.01, 0.01 ]}
            type="VRX"
            animation={{name:'mixamo.com',
              run:true,
              loop:true,
              delay:1000
            }}
          />
          <ViroQuad
            position={[0,0,0]}
            rotation={[-90, 0, 0]}
            height={10} 
            width={10}
            arShadowReceiver={true}
          />
        </ViroNode>
      </ViroARPlane>
    )
  }


  _planeSelected(anchor){
    let modelArray = this.state.modelArray;
    switch (this.state.modelsCounter) {
      case 0:
        modelArray = [...modelArray, this.getMonster(anchor)] 
        break;
      case 1:
        modelArray = [...modelArray, this.getPortal(anchor)]
        break;
    }
    this.setState({
      modelsCounter: this.state.modelsCounter + 1,
      modelArray
    })
  }

  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={200}/>
        <ViroDirectionalLight color="#777777"
          direction={[0, -1, 0]}
          shadowOrthographicPosition={[0, 8, -5]}
          shadowOrthographicSize={10}
          shadowNearZ={2}
          shadowFarZ={9}
          lightInfluenceBitMask={2}
          castsShadow={true} 
        />
        <ViroSpotLight
          innerAngle={5}
          outerAngle={25}
          direction={[0, -1, -.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          shadowMapSize={2048}
          shadowNearZ={5}
          shadowFarZ={5}
          shadowOpacity={.7}
        />
        <ViroText 
          text="change particle effects" 
          color="#ffffff"
          width={2}
          height={2}
          position={[-2, 1, -2]}
          rotation={[0, 45, 0]}
          style={styles.helloWorldTextStyle}
          onClick={() => {
            this.setState({
              currentEffect: this.state.currentEffect + 1 > 2 ? 0 : this.state.currentEffect + 1
            })
          }}
        />
        <ViroARPlaneSelector 
          ref={(selectorRef) => 
              this.arSelectorRef = selectorRef}
          onPlaneSelected={
            this._planeSelected.bind(this)} 
            dragType="FixedToWorld"
        >
        </ViroARPlaneSelector>
        { this.state.modelArray }
        <ViroNode position={[0, 0, -3]}>
          { this.getEffect() } 
        </ViroNode>
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Hello World!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  }
});

 ViroMaterials.createMaterials({
  ground:{
    cullMode: "None",
    shininess: 2.0,
    diffuseColor: "#ff9999",
    lightingModel: "Blinn",
  }
 });



 
module.exports = ArMonster;
