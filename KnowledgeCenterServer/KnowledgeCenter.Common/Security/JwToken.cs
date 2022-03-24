using System.IdentityModel.Tokens.Jwt;

namespace KnowledgeCenter.Common.Security
{
    public class JwToken
    {
        private readonly JwtSecurityToken _token;
        public string Token
        {
            get
            {
                return new JwtSecurityTokenHandler().WriteToken(_token);
            }
        }

        public readonly string RefreshToken;

        public JwToken(JwtSecurityToken token, string refreshToken)
        {
            _token = token;
            RefreshToken = refreshToken;
        }
    }

    public class Tokens
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
