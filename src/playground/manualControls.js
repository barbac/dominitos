import './manualControls.css';

function controls() {
  const joints = ['base', 'shoulder', 'elbow', 'wrist', 'hand', 'gripper'];

  for (let i = 0; i < joints.length; ++i) {
    const jointName = joints[i];
    console.log(i, jointName);
    const joint = document.getElementById(jointName);
    const label = document.getElementById(`${jointName}-label`);
    joint.oninput = e => {
      const degree = e.target.value;
      label.textContent = degree;
      window
        .fetch(`${SERVER_URL}?joint=${i}&degree=${degree}`, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
        .then(response => {
          return response.text();
        })
        .then(text => {
          console.log('response:', text);
        })
        .catch(error => {
          console.log(error);
        });
    };
  }
}

export default controls;
