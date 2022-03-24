using System;
using System.Security.Cryptography;
using System.Text;
using KnowledgeCenter.Common._Interfaces;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace KnowledgeCenter.Common.Security
{
    public class PasswordProvider : IPasswordProvider
    {
        public PasswordAndSalt GenerateNewSaltedPassword(string clearPassword)
        {
            var salt = GetNewSalt();
            var passwordHashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: clearPassword,
                salt: Encoding.UTF8.GetBytes(salt),
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return new PasswordAndSalt(passwordHashed, salt);
        }

        public bool IsHistoricPassword(string supposedClearHistoricPassword, string dbSalt, string dbHashedPassword)
        {
            var passwordHashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: supposedClearHistoricPassword,
                salt: dbSalt == null ? new byte[128 / 8] : Encoding.UTF8.GetBytes(dbSalt),
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return dbHashedPassword.Equals(passwordHashed);
        }

        private string GetNewSalt()
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }
    }
}
