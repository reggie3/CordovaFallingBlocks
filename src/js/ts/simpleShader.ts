export class SimpleShader {
    static groundVertexShader = `
        varying vec4 col;
        void main(){
            col = vec4(1.0, 0.0, 0.0, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    static groundFragmentShader = `
        varying vec4 col;
        void main(){
            gl_FragColor = col;
        }
    `;
}