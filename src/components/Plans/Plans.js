import React from 'react';
import "./Plans.css";

function Plans() {

  return (
    <>
      <div class="wrap">
<div class="con-items">
        <div class="item item1" >
            <header>
                <h3>Basic</h3>
                <p>
                    <b>
                      50 VID Tokens
                    </b>
                </p>
            </header>
            <ul>
                <li>
                    <b>
                      5 GB
                    </b>
                      Additional Storage
                </li>
            </ul>
            <button>
                Choose Plan 
            </button>
        </div>
        <div class="item color item2">
            <span class="badge">
                Popular
            </span>
            <header>
                <h3>Special</h3>
                <p>
                    <b>
                      75 VID Tokens
                    </b>
                </p>
            </header>
            <ul>
                <li>
                    <b>
                        10 GB
                    </b>
                      Additional Storage
                </li>
            </ul>
            <button class="border">
                Choose Plan 
            </button>
        </div>
        <div class="item item3">
            <header>
                <h3>Super Duper</h3>
                <p>
                    <b>
                        100 VID Tokens
                    </b>
                </p>
            </header>
            <ul>
                <li>
                    <b>
                        15 GB
                    </b>
                      Additional Storage
                </li>
            </ul>
            <button>
                Choose Plan 
            </button>
        </div>
    </div>
</div>
    </>
  )
}

export default Plans;