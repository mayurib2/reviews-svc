const superTest = require("supertest");
const should = require("should");
const axios = require('axios');
const request = require('request');
const expect = require('chai').expect;

require("../index.js");

it('Check get reviews by business id is working', function(done) {
    axios.get("localhost:3000/businesses/02151fdb-8b50-4068-b8a1-1d24ed425c59/reviews")
        .then((res) => {
            expect(res.status).to.equal(200);
            done();
        })
        .catch((error) => {
            console.error(error)
            done();
        })
});
