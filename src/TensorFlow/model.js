import * as tf from '@tensorflow/tfjs';

export const createModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    model.compile({optimizer:'sgd', loss: 'meanSquaredError'});
    return model;
}